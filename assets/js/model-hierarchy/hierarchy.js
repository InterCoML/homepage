/**
 * Adaptive Model Hierarchy controller.
 *
 * Query flow: ML-ROM → error check → RB-ROM → error check → FOM
 * - FOM call → extend basis
 * - RB-ROM call → collect ML training data
 * - Retrain ML when basis extends or mlRetrainThreshold new samples collected
 */

import { zeros } from './linalg.js';
import { RBROM, estimateError } from './rbrom.js';
import { MLROM } from './mlrom.js';
import { solveFOM } from './fom.js';
import { solveOptimalitySystem } from './timestepping.js';

export class AdaptiveModelHierarchy {
  constructor(problem, tolerance = 1e-3, mlRetrainThreshold = 5) {
    this.problem = problem;
    this.tolerance = tolerance;
    this.mlRetrainThreshold = mlRetrainThreshold;

    this.rbrom = new RBROM(problem.Gh);
    this.mlrom = new MLROM(
      [
        [1.0, 2.0],  // mu1 range
        [0.5, 1.5],  // mu2 range
      ],
      0.5,    // sigma
      1e-10,  // regularization
    );

    this.newMlSamples = 0;

    // Statistics — counts are for *successful* uses (model result returned)
    this.stats = {
      fomCalls: 0,
      rbromCalls: 0,
      mlromCalls: 0,
      totalQueries: 0,
      fomTotalTime: 0,
      rbromTotalTime: 0,
      mlromTotalTime: 0,
      rbBuildTotalTime: 0,
      rbBuildCount: 0,
      mlTrainTotalTime: 0,
      mlTrainCount: 0,
    };

    // History for visualization
    this.history = [];
  }

  get basisSize() {
    return this.rbrom.basisSize;
  }

  get mlTrainingSamples() {
    return this.mlrom.numTrainingSamples;
  }

  /**
   * Query the hierarchy for a parameter mu = [mu1, mu2].
   * Returns { model, phiT, error, time, control, states, adjoints }
   */
  query(mu) {
    const setup = this.problem.setup(mu);
    this.stats.totalQueries++;

    // Reset per-query error tracking
    this.lastMLError = undefined;
    this.lastRBError = undefined;

    // Step 1: Try ML-ROM
    if (this.mlrom.trained && this.rbrom.basisSize > 0) {
      const t0 = performance.now();
      const alphaML = this.mlrom.predict(mu);
      const phiTML = this.mlrom.reconstruct(alphaML, this.rbrom.basis);
      const { eta } = estimateError(setup, phiTML);
      const totalTime = performance.now() - t0;

      // Record error estimate for plotting (even if ML-ROM fails)
      this.lastMLError = eta;

      if (eta <= this.tolerance) {
        this.stats.mlromCalls++;
        this.stats.mlromTotalTime += totalTime;
        const { adjoints, control, states } = solveOptimalitySystem(setup, phiTML, setup.x0);
        const result = {
          model: 'ML-ROM', phiT: phiTML, error: eta, time: totalTime,
          control, states, adjoints, mu: mu.slice(), xT: setup.xT,
        };
        this.history.push(result);
        return result;
      }
    }

    // Step 2: Try RB-ROM
    if (this.rbrom.basisSize > 0) {
      const t0 = performance.now();
      const { alpha, phiT: phiTRB } = this.rbrom.solve(setup);
      const { eta } = estimateError(setup, phiTRB);
      const totalTime = performance.now() - t0;

      this.lastRBError = eta;

      // Collect ML training data
      this.mlrom.addTrainingSample(mu, alpha);
      this.newMlSamples++;
      if (this.newMlSamples >= this.mlRetrainThreshold) {
        this._trainML();
      }

      if (eta <= this.tolerance) {
        this.stats.rbromCalls++;
        this.stats.rbromTotalTime += totalTime;
        const { adjoints, control, states } = solveOptimalitySystem(setup, phiTRB, setup.x0);
        const result = {
          model: 'RB-ROM', phiT: phiTRB, error: eta, time: totalTime,
          control, states, adjoints, mu: mu.slice(), xT: setup.xT,
        };
        this.history.push(result);
        return result;
      }
    }

    // Step 3: Fall back to FOM
    const t0 = performance.now();
    const fomResult = solveFOM(setup);
    const totalTime = performance.now() - t0;

    this.stats.fomCalls++;
    this.stats.fomTotalTime += totalTime;

    // Extend reduced basis (timed)
    this._extendBasis(fomResult.phiT);

    // Retrain ML-ROM with new basis size
    this._trainML();

    const result = {
      model: 'FOM', phiT: fomResult.phiT, error: 0, time: totalTime,
      control: fomResult.control, states: fomResult.states,
      adjoints: fomResult.adjoints, mu: mu.slice(), xT: setup.xT,
    };
    this.history.push(result);
    return result;
  }

  _extendBasis(phiT) {
    const t0 = performance.now();
    this.rbrom.extendBasis(phiT);
    const dt = performance.now() - t0;
    this.stats.rbBuildTotalTime += dt;
    this.stats.rbBuildCount++;
  }

  _trainML() {
    const t0 = performance.now();
    this.mlrom.train(this.rbrom.basisSize);
    const dt = performance.now() - t0;
    this.stats.mlTrainTotalTime += dt;
    this.stats.mlTrainCount++;
    this.newMlSamples = 0;
  }

  /** Reset everything to initial state. */
  reset() {
    this.rbrom = new RBROM(this.problem.Gh);
    this.mlrom = new MLROM(
      [[1.0, 2.0], [0.5, 1.5]],
      0.5, 1e-10,
    );
    this.newMlSamples = 0;
    this.stats = {
      fomCalls: 0, rbromCalls: 0, mlromCalls: 0, totalQueries: 0,
      fomTotalTime: 0, rbromTotalTime: 0, mlromTotalTime: 0,
      rbBuildTotalTime: 0, rbBuildCount: 0,
      mlTrainTotalTime: 0, mlTrainCount: 0,
    };
    this.history = [];
  }
}
