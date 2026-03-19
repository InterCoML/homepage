/**
 * Reduced Basis ROM for the optimal control problem.
 *
 * Given a reduced basis {phi_1, ..., phi_N}, approximates the final-time adjoint
 * as a linear combination: phiT_approx = sum_i alpha_i * phi_i
 *
 * The coefficients are found via least-squares on the normal equations:
 *   X_bar^T X_bar alpha = X_bar^T rhs
 * where X_bar = [(I+M*Lambda)phi_1, ..., (I+M*Lambda)phi_N] and rhs = M*(x0_T - xT).
 */

import { zeros, copy, dot, norm, axpy, scal, solveDense } from './linalg.js';
import { solveHomogeneousFinal, applyOperator } from './timestepping.js';

export class RBROM {
  constructor(Gh) {
    this.basis = [];       // orthonormal basis vectors (G-inner product)
    this.Gh = Gh;          // spatial inner product weight h
  }

  get basisSize() {
    return this.basis.length;
  }

  /**
   * Extend the reduced basis with a new vector via Gram-Schmidt.
   * Returns true if the vector was added (linearly independent).
   */
  extendBasis(newVec) {
    const v = copy(newVec);
    // Gram-Schmidt with G = h * I
    for (const phi of this.basis) {
      const proj = this.Gh * dot(phi, v);
      axpy(-proj, phi, v);
    }
    const normV = Math.sqrt(this.Gh * dot(v, v));
    if (normV < 1e-10) return false;
    scal(1.0 / normV, v);
    this.basis.push(v);
    return true;
  }

  /**
   * Solve the RB-ROM for a given parameter setup.
   * Returns { alpha, phiT, time }
   */
  solve(setup) {
    const N = this.basis.length;
    if (N === 0) return { alpha: [], phiT: zeros(setup.n), time: 0 };

    const t0 = performance.now();
    const n = setup.n;

    // Compute RHS: x0_T - xT (M = I)
    const x0T = solveHomogeneousFinal(setup, setup.x0);
    const rhs = new Float64Array(n);
    for (let i = 0; i < n; i++) rhs[i] = x0T[i] - setup.xT[i];

    // Compute X_bar columns: (I + M*Lambda) phi_i
    const Xbar = new Array(N);
    for (let i = 0; i < N; i++) {
      Xbar[i] = applyOperator(setup, this.basis[i]);
    }

    // Build Gram matrix G = X_bar^T * X_bar (N x N, row-major)
    const G = new Float64Array(N * N);
    for (let i = 0; i < N; i++) {
      for (let j = i; j < N; j++) {
        const val = dot(Xbar[i], Xbar[j]);
        G[i * N + j] = val;
        G[j * N + i] = val;
      }
    }

    // Build RHS: X_bar^T * rhs (N-vector)
    const b = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      b[i] = dot(Xbar[i], rhs);
    }

    // Solve normal equations
    const alpha = solveDense(G, b, N);

    // Reconstruct phiT = sum_i alpha_i * phi_i
    const phiT = zeros(n);
    for (let i = 0; i < N; i++) {
      axpy(alpha[i], this.basis[i], phiT);
    }

    const time = performance.now() - t0;
    return { alpha: Array.from(alpha), phiT, time };
  }
}

/**
 * Compute the residual-based error estimator.
 * eta_mu(p) = ||(x0_T - xT) - (I + Lambda) p||_G
 * where ||v||_G = sqrt(h * sum v_i^2) approximates the L2 norm.
 */
export function estimateError(setup, p) {
  const t0 = performance.now();
  const n = setup.n;

  // Compute RHS
  const x0T = solveHomogeneousFinal(setup, setup.x0);
  const rhs = new Float64Array(n);
  for (let i = 0; i < n; i++) rhs[i] = x0T[i] - setup.xT[i];

  // Compute (I + Lambda) p
  const Ap = applyOperator(setup, p);

  // Residual = rhs - Ap
  const residual = new Float64Array(n);
  for (let i = 0; i < n; i++) residual[i] = rhs[i] - Ap[i];

  // Use G-weighted norm (L2 approximation): ||v||_G = sqrt(h * sum v_i^2)
  const eta = Math.sqrt(setup.Gh) * norm(residual);
  const time = performance.now() - t0;
  return { eta, time };
}
