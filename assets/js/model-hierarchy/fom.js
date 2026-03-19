/**
 * Full-Order Model: BiCGSTAB solver for the optimal control problem.
 *
 * Solves: (I + M * Lambda) phi*(T) = M * (e^{AT} x0 - xT)
 * With M = I: (I + Lambda) phi*(T) = e^{AT} x0 - xT
 *
 * Uses BiCGSTAB (Bi-Conjugate Gradient Stabilized) because the discrete
 * operator (I + Lambda) is not symmetric under implicit Euler time stepping.
 */

import { zeros, copy, dot, norm, axpy, scal } from './linalg.js';
import { solveHomogeneousFinal, applyOperator, solveOptimalitySystem } from './timestepping.js';

/**
 * Solve the FOM using BiCGSTAB.
 * Returns { phiT, control, states, adjoints, iters, time }
 */
export function solveFOM(setup, options = {}) {
  const { maxIter = 500, tol = 1e-8 } = options;
  const n = setup.n;
  const t0 = performance.now();

  // Compute RHS: M * (x0_T - xT) with M = I
  const x0T = solveHomogeneousFinal(setup, setup.x0);
  const rhs = new Float64Array(n);
  for (let i = 0; i < n; i++) rhs[i] = x0T[i] - setup.xT[i];

  const rhsNorm = norm(rhs);
  if (rhsNorm < 1e-16) {
    const phi = zeros(n);
    const { adjoints, control, states } = solveOptimalitySystem(setup, phi, setup.x0);
    return { phiT: phi, control, states, adjoints, iters: 0, time: performance.now() - t0 };
  }

  // BiCGSTAB iteration
  let x = zeros(n);  // initial guess
  let r = copy(rhs);  // r = rhs - A*x = rhs (since x=0)
  const r0hat = copy(r);  // arbitrary, typically r0hat = r
  let p = copy(r);
  let rho = dot(r0hat, r);

  let iter = 0;
  for (; iter < maxIter; iter++) {
    // Check convergence
    const rNorm = norm(r);
    if (rNorm / rhsNorm < tol) break;

    // Ap = A * p
    const Ap = applyOperator(setup, p);
    const alpha = rho / dot(r0hat, Ap);

    // s = r - alpha * Ap
    const s = copy(r);
    axpy(-alpha, Ap, s);

    // Check if s is small enough
    const sNorm = norm(s);
    if (sNorm / rhsNorm < tol) {
      axpy(alpha, p, x);
      break;
    }

    // As = A * s
    const As = applyOperator(setup, s);
    const omega = dot(As, s) / dot(As, As);

    // x = x + alpha * p + omega * s
    axpy(alpha, p, x);
    axpy(omega, s, x);

    // r = s - omega * As
    for (let i = 0; i < n; i++) r[i] = s[i] - omega * As[i];

    const rhoNew = dot(r0hat, r);
    if (Math.abs(rhoNew) < 1e-30 || Math.abs(omega) < 1e-30) {
      console.warn('BiCGSTAB breakdown at iteration', iter);
      break;
    }

    const beta = (rhoNew / rho) * (alpha / omega);
    rho = rhoNew;

    // p = r + beta * (p - omega * Ap)
    for (let i = 0; i < n; i++) {
      p[i] = r[i] + beta * (p[i] - omega * Ap[i]);
    }
  }

  const finalResNorm = norm(r);
  console.log(`FOM BiCGSTAB converged in ${iter} iterations, relative residual: ${(finalResNorm / rhsNorm).toExponential(2)}`);

  // Recover full solution
  const { adjoints, control, states } = solveOptimalitySystem(setup, x, setup.x0);

  const time = performance.now() - t0;
  return { phiT: x, control, states, adjoints, iters: iter, time };
}
