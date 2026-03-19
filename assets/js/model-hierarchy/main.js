/**
 * Main entry point for the interactive model hierarchy demo.
 * Handles UI wiring, event listeners, and batch execution.
 */

import { createProblem } from './problem.js';
import { AdaptiveModelHierarchy } from './hierarchy.js';
import {
  initPlots, updateParameterSpace, updateErrorPlot,
  updateTimingPlot, updateSolutionPlot, resetPlots,
  onParameterSpaceClick,
} from './visualization.js';

let problem = null;
let hierarchy = null;
let batchRunning = false;
let batchCancelRequested = false;

function init() {
  problem = createProblem(50);
  hierarchy = new AdaptiveModelHierarchy(problem, parseFloat(document.getElementById('tolerance').value));
  initPlots();
  updateStats();

  // Allow clicking in the parameter space plot to query that parameter
  onParameterSpaceClick(function (mu) {
    if (batchRunning) return;
    document.getElementById('mu1-slider').value = mu[0];
    document.getElementById('mu1-value').textContent = mu[0].toFixed(2);
    document.getElementById('mu2-slider').value = mu[1];
    document.getElementById('mu2-value').textContent = mu[1].toFixed(2);
    processQuery(mu);
  });
}

function updateStats() {
  const s = hierarchy.stats;
  document.getElementById('stat-fom').textContent = s.fomCalls;
  document.getElementById('stat-rbrom').textContent = s.rbromCalls;
  document.getElementById('stat-mlrom').textContent = s.mlromCalls;
  document.getElementById('stat-total').textContent = s.totalQueries;
  document.getElementById('stat-basis').textContent = hierarchy.basisSize;
  document.getElementById('stat-ml-samples').textContent = hierarchy.mlTrainingSamples;

  const avgFom = s.fomCalls > 0 ? (s.fomTotalTime / s.fomCalls).toFixed(1) : '-';
  const avgRb = s.rbromCalls > 0 ? (s.rbromTotalTime / s.rbromCalls).toFixed(1) : '-';
  const avgMl = s.mlromCalls > 0 ? (s.mlromTotalTime / s.mlromCalls).toFixed(1) : '-';
  document.getElementById('stat-avg-fom').textContent = avgFom;
  document.getElementById('stat-avg-rbrom').textContent = avgRb;
  document.getElementById('stat-avg-mlrom').textContent = avgMl;

  document.getElementById('stat-rb-build-time').textContent =
    s.rbBuildCount > 0 ? `${s.rbBuildTotalTime.toFixed(1)} ms (${s.rbBuildCount}x)` : '-';
  document.getElementById('stat-ml-train-time').textContent =
    s.mlTrainCount > 0 ? `${s.mlTrainTotalTime.toFixed(1)} ms (${s.mlTrainCount}x)` : '-';
}

function showLastResult(result) {
  const el = document.getElementById('last-result');
  el.innerHTML = `
    <strong>Model used:</strong> <span style="color:${
      result.model === 'FOM' ? '#c0392b' : result.model === 'RB-ROM' ? '#e67e22' : '#27ae60'
    }">${result.model}</span><br>
    <strong>Error estimate:</strong> <span style="font-family:monospace">${result.error > 0 ? result.error.toExponential(2) : 'exact (FOM)'}</span><br>
    <strong>Time:</strong> <span style="font-family:monospace">${result.time.toFixed(1)} ms</span>
  `;
}

/** Run a single query and update all plots. */
function processQuery(mu) {
  const tol = parseFloat(document.getElementById('tolerance').value);
  hierarchy.tolerance = tol;

  const result = hierarchy.query(mu);
  const qNum = hierarchy.stats.totalQueries;

  updateParameterSpace(result, qNum);
  updateErrorPlot(hierarchy.lastMLError, hierarchy.lastRBError, qNum, tol);
  updateTimingPlot(result, qNum);
  updateSolutionPlot(result, problem.yGrid);
  updateStats();
  showLastResult(result);
}

function querySingle() {
  if (batchRunning) return;
  const mu1 = parseFloat(document.getElementById('mu1-slider').value);
  const mu2 = parseFloat(document.getElementById('mu2-slider').value);
  processQuery([mu1, mu2]);
}

function queryRandom() {
  if (batchRunning) return;
  const mu1 = 1.0 + Math.random();
  const mu2 = 0.5 + Math.random();
  // Update sliders to show the sampled parameter
  document.getElementById('mu1-slider').value = mu1;
  document.getElementById('mu1-value').textContent = mu1.toFixed(2);
  document.getElementById('mu2-slider').value = mu2;
  document.getElementById('mu2-value').textContent = mu2.toFixed(2);
  processQuery([mu1, mu2]);
}

async function runBatch() {
  if (batchRunning) {
    batchCancelRequested = true;
    return;
  }

  const nQueries = parseInt(document.getElementById('batch-size').value) || 200;
  const tol = parseFloat(document.getElementById('tolerance').value);
  hierarchy.tolerance = tol;

  // Generate random parameters
  const params = [];
  for (let i = 0; i < nQueries; i++) {
    const mu1 = 1.0 + Math.random();
    const mu2 = 0.5 + Math.random();
    params.push([mu1, mu2]);
  }

  batchRunning = true;
  batchCancelRequested = false;
  const btn = document.getElementById('btn-batch');
  btn.textContent = 'Stop Batch';

  let i = 0;
  function step() {
    if (i >= params.length || batchCancelRequested) {
      batchRunning = false;
      batchCancelRequested = false;
      btn.textContent = 'Run Batch';
      return;
    }

    // Process a chunk of queries per frame for speed
    const chunkSize = Math.min(5, params.length - i);
    for (let c = 0; c < chunkSize; c++) {
      const result = hierarchy.query(params[i]);
      const qNum = hierarchy.stats.totalQueries;
      updateParameterSpace(result, qNum);
      updateErrorPlot(hierarchy.lastMLError, hierarchy.lastRBError, qNum, tol);
      updateTimingPlot(result, qNum);
      if (c === chunkSize - 1) {
        updateSolutionPlot(result, problem.yGrid);
      }
      i++;
    }
    updateStats();
    showLastResult(hierarchy.history[hierarchy.history.length - 1]);

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function resetAll() {
  if (batchRunning) {
    batchCancelRequested = true;
  }
  setTimeout(() => {
    const tol = parseFloat(document.getElementById('tolerance').value);
    problem = createProblem(50);
    hierarchy = new AdaptiveModelHierarchy(problem, tol);
    resetPlots();
    updateStats();
    document.getElementById('last-result').innerHTML = '<em>No queries yet</em>';
  }, 50);
}

// Slider value display
function setupSlider(id, displayId) {
  const slider = document.getElementById(id);
  const display = document.getElementById(displayId);
  display.textContent = parseFloat(slider.value).toFixed(2);
  slider.addEventListener('input', () => {
    display.textContent = parseFloat(slider.value).toFixed(2);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupSlider('mu1-slider', 'mu1-value');
  setupSlider('mu2-slider', 'mu2-value');
  document.getElementById('btn-query').addEventListener('click', querySingle);
  document.getElementById('btn-random').addEventListener('click', queryRandom);
  document.getElementById('btn-batch').addEventListener('click', runBatch);
  document.getElementById('btn-reset').addEventListener('click', resetAll);
  init();
});
