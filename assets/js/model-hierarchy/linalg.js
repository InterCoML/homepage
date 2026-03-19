/**
 * Linear algebra primitives on Float64Array.
 */

export function zeros(n) {
  return new Float64Array(n);
}

export function copy(a) {
  return new Float64Array(a);
}

export function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function norm(a) {
  return Math.sqrt(dot(a, a));
}

/** y = alpha * x + y */
export function axpy(alpha, x, y) {
  for (let i = 0; i < x.length; i++) y[i] += alpha * x[i];
}

/** x = alpha * x */
export function scal(alpha, x) {
  for (let i = 0; i < x.length; i++) x[i] *= alpha;
}

/** Return alpha * x + beta * y as new array */
export function linComb(alpha, x, beta, y) {
  const r = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) r[i] = alpha * x[i] + beta * y[i];
  return r;
}

/**
 * Precompute Thomas algorithm factorization for tridiagonal system.
 * Stores modified diagonal and lower entries.
 * Input: lower[0..n-2], diag[0..n-1], upper[0..n-2]
 */
export function thomasFactorize(lower, diag, upper) {
  const n = diag.length;
  const d = new Float64Array(n);   // modified diagonal
  const l = new Float64Array(n - 1); // multipliers
  d[0] = diag[0];
  for (let i = 1; i < n; i++) {
    l[i - 1] = lower[i - 1] / d[i - 1];
    d[i] = diag[i] - l[i - 1] * upper[i - 1];
  }
  return { d, l, upper };
}

/**
 * Solve Ax = rhs using precomputed Thomas factorization.
 * Writes result into rhs (in-place) and returns it.
 */
export function thomasSolve(fact, rhs) {
  const n = fact.d.length;
  const { d, l, upper } = fact;
  // Forward substitution
  for (let i = 1; i < n; i++) {
    rhs[i] -= l[i - 1] * rhs[i - 1];
  }
  // Back substitution
  rhs[n - 1] /= d[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rhs[i] = (rhs[i] - upper[i] * rhs[i + 1]) / d[i];
  }
  return rhs;
}

/**
 * Solve dense N x N system Ax = b using Gaussian elimination with partial pivoting.
 * A is stored as flat Float64Array of length N*N (row-major). b is Float64Array of length N.
 * Returns solution x (new array). A and b are not modified.
 */
export function solveDense(A, b, N) {
  // Copy
  const a = new Float64Array(A);
  const x = new Float64Array(b);

  // Forward elimination with partial pivoting
  for (let k = 0; k < N; k++) {
    // Find pivot
    let maxVal = Math.abs(a[k * N + k]);
    let maxRow = k;
    for (let i = k + 1; i < N; i++) {
      const v = Math.abs(a[i * N + k]);
      if (v > maxVal) { maxVal = v; maxRow = i; }
    }
    // Swap rows
    if (maxRow !== k) {
      for (let j = k; j < N; j++) {
        const tmp = a[k * N + j];
        a[k * N + j] = a[maxRow * N + j];
        a[maxRow * N + j] = tmp;
      }
      const tmp = x[k]; x[k] = x[maxRow]; x[maxRow] = tmp;
    }
    // Eliminate
    for (let i = k + 1; i < N; i++) {
      const factor = a[i * N + k] / a[k * N + k];
      for (let j = k + 1; j < N; j++) {
        a[i * N + j] -= factor * a[k * N + j];
      }
      x[i] -= factor * x[k];
    }
  }

  // Back substitution
  for (let k = N - 1; k >= 0; k--) {
    for (let j = k + 1; j < N; j++) {
      x[k] -= a[k * N + j] * x[j];
    }
    x[k] /= a[k * N + k];
  }
  return x;
}
