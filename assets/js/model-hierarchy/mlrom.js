/**
 * Machine Learning ROM using RBF (Gaussian kernel) interpolation.
 *
 * One scalar model per reduced basis coefficient (avoids zero-padding bias).
 * All training points are used as centers; the weight vector is obtained by
 * solving K * w = y where K is the kernel matrix.
 */

import { solveDense } from './linalg.js';

/**
 * Gaussian kernel: k(x, y) = exp(-||x - y||^2 / (2 * sigma^2))
 */
function gaussianKernel(x, y, sigma) {
  let sq = 0;
  for (let i = 0; i < x.length; i++) {
    const d = x[i] - y[i];
    sq += d * d;
  }
  return Math.exp(-sq / (2 * sigma * sigma));
}

class RBFModel {
  constructor(sigma, reg) {
    this.sigma = sigma;
    this.reg = reg;
    this.centers = null;  // scaled parameter vectors
    this.weights = null;
  }

  /**
   * Fit the model. X: array of parameter vectors, y: array of scalar targets.
   */
  fit(X, y) {
    const n = X.length;
    if (n === 0) return;

    this.centers = X.map(x => x.slice());

    // Build kernel matrix K (n x n, row-major)
    const K = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const val = gaussianKernel(X[i], X[j], this.sigma);
        K[i * n + j] = val;
        K[j * n + i] = val;
      }
      K[i * n + i] += this.reg;  // Tikhonov regularization
    }

    // Solve K * w = y
    const rhs = new Float64Array(y);
    this.weights = solveDense(K, rhs, n);
  }

  /**
   * Predict for a single parameter vector x.
   */
  predict(x) {
    if (!this.centers || this.centers.length === 0) return 0;
    let result = 0;
    for (let i = 0; i < this.centers.length; i++) {
      result += this.weights[i] * gaussianKernel(x, this.centers[i], this.sigma);
    }
    return result;
  }
}

export class MLROM {
  /**
   * @param {number[]} paramRanges - [[min1, max1], [min2, max2]] for scaling
   * @param {number} sigma - kernel length scale (on scaled [0,1]^d space)
   * @param {number} reg - regularization parameter
   */
  constructor(paramRanges, sigma = 0.5, reg = 1e-10) {
    this.paramRanges = paramRanges;
    this.sigma = sigma;
    this.reg = reg;
    this.models = [];         // one RBFModel per coefficient
    this.trainingData = [];   // { mu: [mu1,mu2], alpha: [a1,...,aN] }
    this.trained = false;
  }

  /** Scale a parameter to [0,1]^d */
  scale(mu) {
    return mu.map((val, i) => {
      const [lo, hi] = this.paramRanges[i];
      return (val - lo) / (hi - lo);
    });
  }

  /** Add training sample */
  addTrainingSample(mu, alpha) {
    this.trainingData.push({ mu: mu.slice(), alpha: alpha.slice() });
  }

  get numTrainingSamples() {
    return this.trainingData.length;
  }

  /**
   * (Re)train the ML models. One model per coefficient.
   * @param {number} N - current basis size
   */
  train(N) {
    if (this.trainingData.length === 0 || N === 0) {
      this.trained = false;
      return;
    }

    this.models = [];
    for (let j = 0; j < N; j++) {
      // Collect training data for coefficient j
      const X = [];
      const y = [];
      for (const sample of this.trainingData) {
        if (j < sample.alpha.length) {
          X.push(this.scale(sample.mu));
          y.push(sample.alpha[j]);
        }
      }
      const model = new RBFModel(this.sigma, this.reg);
      if (X.length > 0) {
        model.fit(X, new Float64Array(y));
      }
      this.models.push(model);
    }
    this.trained = true;
  }

  /**
   * Predict coefficients for a given parameter.
   * Returns array of N coefficients.
   */
  predict(mu) {
    if (!this.trained || this.models.length === 0) return [];
    const muScaled = this.scale(mu);
    return this.models.map(model => model.predict(muScaled));
  }

  /**
   * Reconstruct the approximate final-time adjoint from predicted coefficients.
   * @param {number[]} alpha - predicted coefficients
   * @param {Float64Array[]} basis - reduced basis vectors
   * @returns {Float64Array} approximate phiT
   */
  reconstruct(alpha, basis) {
    const n = basis[0].length;
    const phiT = new Float64Array(n);
    for (let i = 0; i < alpha.length && i < basis.length; i++) {
      for (let j = 0; j < n; j++) {
        phiT[j] += alpha[i] * basis[i][j];
      }
    }
    return phiT;
  }
}
