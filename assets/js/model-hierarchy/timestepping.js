/**
 * Implicit Euler time stepping for state and adjoint equations.
 *
 * State equation (forward):
 *   (I - dt*A) x[k+1] = x[k] + dt * B * u[k+1]
 *
 * Adjoint equation (backward):
 *   (I - dt*A^T) phi[k] = phi[k+1]
 *   Since A is symmetric for the heat equation, A^T = A, same factorization.
 *
 * Control from adjoint:
 *   u(t) = -R^{-1} B^T phi(t)
 */

import { thomasSolve, zeros, copy } from './linalg.js';

/**
 * Solve state equation forward: x(0) = x0, driven by control u.
 * u is array of nt vectors of length m (u[k] for k=0..nt-1, applied at step k+1).
 * Returns array of (nt+1) state vectors.
 */
export function solveStateForward(setup, x0, u) {
  const { fact, Bval, dt, nt, n } = setup;
  const states = new Array(nt + 1);
  states[0] = copy(x0);

  for (let k = 0; k < nt; k++) {
    const rhs = copy(states[k]);
    // Add dt * B * u[k] (B is sparse: only first and last rows)
    if (u) {
      rhs[0] += dt * Bval * u[k][0];
      rhs[n - 1] += dt * Bval * u[k][1];
    }
    thomasSolve(fact, rhs);
    states[k + 1] = rhs;
  }
  return states;
}

/**
 * Solve adjoint equation backward: phi(T) = phiT.
 * Returns array of (nt+1) adjoint vectors, phi[0]..phi[nt] where phi[nt] = phiT.
 */
export function solveAdjointBackward(setup, phiT) {
  const { fact, nt } = setup;
  const adjoints = new Array(nt + 1);
  adjoints[nt] = copy(phiT);

  for (let k = nt - 1; k >= 0; k--) {
    const rhs = copy(adjoints[k + 1]);
    thomasSolve(fact, rhs);
    adjoints[k] = rhs;
  }
  return adjoints;
}

/**
 * Solve homogeneous state equation (no control) from x0.
 * Returns only the final state x(T) to save memory.
 */
export function solveHomogeneousFinal(setup, x0) {
  const { fact, nt } = setup;
  let x = copy(x0);
  for (let k = 0; k < nt; k++) {
    thomasSolve(fact, x);
  }
  return x;
}

/**
 * Compute control from adjoint trajectory: u[k] = -R^{-1} B^T phi[k+1]
 * B^T phi = [Bval * phi[0], Bval * phi[n-1]]
 * Returns array of nt control vectors (each of length m=2).
 */
export function getControlFromAdjoint(setup, adjoints) {
  const { Bval, Rinv, nt, n } = setup;
  const u = new Array(nt);
  for (let k = 0; k < nt; k++) {
    const phi = adjoints[k + 1];
    u[k] = [
      -Rinv[0] * Bval * phi[0],
      -Rinv[1] * Bval * phi[n - 1],
    ];
  }
  return u;
}

/**
 * Given a final-time adjoint phiT, compute the full optimality system:
 * 1. Solve adjoint backward from phiT
 * 2. Compute control from adjoint
 * 3. Solve state forward with x0=0 driven by control
 * Returns { adjoints, control, states }
 */
export function solveOptimalitySystem(setup, phiT, x0) {
  const adjoints = solveAdjointBackward(setup, phiT);
  const control = getControlFromAdjoint(setup, adjoints);
  const states = solveStateForward(setup, x0, control);
  return { adjoints, control, states };
}

/**
 * Apply the operator (I + M * Lambda) to a vector p.
 * With M = I: (I + Lambda) p = p + Lambda p
 * Lambda p is computed by:
 *   1. Solve adjoint backward from phi(T) = p
 *   2. Compute control u = -R^{-1} B^T phi
 *   3. Solve state forward from x(0) = 0 with control u
 *   4. Lambda p = -x(T)
 * So (I + Lambda) p = p - x(T)
 */
export function applyOperator(setup, p) {
  const n = setup.n;
  const zeroX0 = zeros(n);
  const { states } = solveOptimalitySystem(setup, p, zeroX0);
  const xT = states[setup.nt];

  // result = p - x(T)  (since M = I)
  const result = copy(p);
  for (let i = 0; i < n; i++) result[i] -= xT[i];
  return result;
}
