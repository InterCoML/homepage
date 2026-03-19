/**
 * Parametrized 1D heat equation with Dirichlet boundary control.
 *
 * Domain: [0,1], T=0.1
 * Parameter: mu = [mu1, mu2] in [1,2] x [0.5,1.5]
 *   mu1 = diffusivity, mu2 = target slope
 * Initial condition: sin(pi * y)
 * Target state: mu2 * y
 * Control: 2 boundary controls (left and right Dirichlet)
 * Discretization: finite differences (n inner points), implicit Euler (nt steps)
 */

import { thomasFactorize, zeros } from './linalg.js';

export const PARAM_RANGES = {
  mu1: [1.0, 2.0],
  mu2: [0.5, 1.5],
};

export function createProblem(n = 50) {
  const h = 1.0 / (n + 1);
  const nt = 10 * n;  // 500 for n=50
  const T = 0.1;
  const dt = T / nt;
  const m = 2;  // number of controls

  // Grid points (inner)
  const yGrid = new Float64Array(n);
  for (let i = 0; i < n; i++) yGrid[i] = (i + 1) * h;

  // Stiffness matrix A_tilde (tridiagonal): -2 on diag, 1 on off-diag
  // A(mu) = mu1 * A_tilde / h^2
  // We store A_tilde's bands
  const aTildeDiag = new Float64Array(n).fill(-2.0);
  const aTildeOff = new Float64Array(n - 1).fill(1.0);

  // Control operator B_base (n x 2): B[0,0] = 1/h^2, B[n-1,1] = 1/h^2
  // B(mu) = mu1 * B_base

  // Initial condition: x0 = sin(pi * y)
  const x0 = new Float64Array(n);
  for (let i = 0; i < n; i++) x0[i] = Math.sin(Math.PI * yGrid[i]);

  // Target state base: y_grid (multiply by mu2)
  const xTBase = new Float64Array(yGrid);

  // Control weight R = diag(0.125, 0.25)
  const R = [0.125, 0.25];
  const Rinv = [1.0 / R[0], 1.0 / R[1]];

  // Spatial inner product weight (L2 with trapezoidal-like FD quadrature)
  const Gh = h;

  /**
   * Get parameter-dependent quantities and precomputed factorizations.
   */
  function setup(mu) {
    const mu1 = mu[0];
    const mu2 = mu[1];

    // System matrix for implicit Euler: (I - dt * mu1 * A_tilde / h^2)
    // Diagonal: 1 + 2 * dt * mu1 / h^2
    // Off-diagonal: -dt * mu1 / h^2
    const coeff = dt * mu1 / (h * h);
    const sysDiag = new Float64Array(n);
    const sysLower = new Float64Array(n - 1);
    const sysUpper = new Float64Array(n - 1);
    for (let i = 0; i < n; i++) sysDiag[i] = 1.0 + 2.0 * coeff;
    for (let i = 0; i < n - 1; i++) {
      sysLower[i] = -coeff;
      sysUpper[i] = -coeff;
    }
    const fact = thomasFactorize(sysLower, sysDiag, sysUpper);

    // B(mu) values: B[0,0] = mu1/h^2, B[n-1,1] = mu1/h^2
    const Bval = mu1 / (h * h);

    // Target state
    const xT = new Float64Array(n);
    for (let i = 0; i < n; i++) xT[i] = mu2 * xTBase[i];

    return { mu, fact, Bval, x0, xT, Rinv, dt, nt, n, m, Gh };
  }

  return { n, nt, T, dt, h, m, x0, xTBase, R, Rinv, Gh, yGrid, setup };
}
