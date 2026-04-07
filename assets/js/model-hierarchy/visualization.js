/**
 * Plotly.js-based visualization for the adaptive model hierarchy demo.
 */

const MODEL_COLORS = {
  'FOM': '#c0392b',
  'RB-ROM': '#e67e22',
  'ML-ROM': '#27ae60',
};

// Track tolerance line segments: [{x0, x1, y}]
let toleranceSegments = [];
let currentTolerance = null;
let currentToleranceStart = 1;

/**
 * Initialize all plots.
 */
export function initPlots() {
  toleranceSegments = [];
  currentTolerance = null;
  currentToleranceStart = 1;
  initParameterSpacePlot();
  initErrorPlot();
  initSolutionPlot();
  initTimingPlot();
}

function initParameterSpacePlot() {
  const layout = {
    title: { text: 'Parameter Space', font: { size: 14 } },
    xaxis: { title: '\u03bc\u2081 (diffusivity)', range: [0.95, 2.05] },
    yaxis: { title: '\u03bc\u2082 (target slope)', range: [0.45, 1.55] },
    margin: { t: 40, b: 50, l: 55, r: 20 },
    showlegend: true,
    legend: { x: 0, y: 1, bgcolor: 'rgba(255,255,255,0.8)', font: { size: 11 } },
  };

  const traces = ['FOM', 'RB-ROM', 'ML-ROM'].map(model => ({
    x: [], y: [],
    mode: 'markers',
    type: 'scatter',
    name: model,
    marker: { color: MODEL_COLORS[model], size: 6 },
  }));

  Plotly.newPlot('param-space-plot', traces, layout, { responsive: true });
}

/**
 * Set up click handler on parameter space plot.
 * @param {function} callback - called with [mu1, mu2] when user clicks
 */
export function onParameterSpaceClick(callback) {
  const plotEl = document.getElementById('param-space-plot');
  plotEl.on('plotly_click', function (data) {
    // Use the clicked coordinates (xaxis/yaxis values)
    const pt = data.points[0];
    if (pt) {
      callback([pt.x, pt.y]);
    }
  });
  // Also handle clicking on empty space (no existing point)
  plotEl.addEventListener('dblclick', function (e) {
    // Plotly doesn't fire plotly_click for empty space, use dblclick with coordinate conversion
  });
  // Use plotly_clickannotation or a custom approach for empty space clicks
  // Actually, the best approach for Plotly is to add an invisible scatter trace covering the space
  // and listen for clicks on it.
  Plotly.addTraces('param-space-plot', {
    x: [1.0, 2.0, 1.0, 2.0],
    y: [0.5, 0.5, 1.5, 1.5],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 0.1, opacity: 0 },
    showlegend: false,
    hoverinfo: 'none',
  });
  // Override: use the layout click event via a custom overlay
  plotEl.style.cursor = 'crosshair';
  plotEl.addEventListener('click', function (e) {
    const xaxis = plotEl._fullLayout.xaxis;
    const yaxis = plotEl._fullLayout.yaxis;
    if (!xaxis || !yaxis) return;

    const bb = plotEl.getBoundingClientRect();
    const x = e.clientX - bb.left;
    const y = e.clientY - bb.top;

    // Convert pixel to data coordinates
    const mu1 = xaxis.p2d(x - xaxis._offset);
    const mu2 = yaxis.p2d(y - yaxis._offset);

    // Check bounds
    if (mu1 >= 1.0 && mu1 <= 2.0 && mu2 >= 0.5 && mu2 <= 1.5) {
      callback([mu1, mu2]);
    }
  });
}

function initErrorPlot() {
  const layout = {
    title: { text: 'Error Estimates', font: { size: 14 } },
    xaxis: { title: 'Query number' },
    yaxis: { title: 'Error estimate', type: 'log', autorange: true, exponentformat: 'power' },
    margin: { t: 40, b: 50, l: 60, r: 20 },
    showlegend: true,
    legend: { x: 0, y: 1, bgcolor: 'rgba(255,255,255,0.8)', font: { size: 11 } },
    shapes: [],
  };

  const traces = [
    { x: [], y: [], mode: 'markers', type: 'scatter', name: 'ML-ROM',
      marker: { color: MODEL_COLORS['ML-ROM'], size: 5 } },
    { x: [], y: [], mode: 'markers', type: 'scatter', name: 'RB-ROM',
      marker: { color: MODEL_COLORS['RB-ROM'], size: 5 } },
  ];

  Plotly.newPlot('error-plot', traces, layout, { responsive: true });
}

function initTimingPlot() {
  const layout = {
    title: { text: 'Time per Query (ms)', font: { size: 14 } },
    xaxis: { title: 'Query number' },
    yaxis: { title: 'Time (ms)', type: 'log', autorange: true, exponentformat: 'power' },
    margin: { t: 40, b: 50, l: 55, r: 20 },
    showlegend: true,
    legend: { x: 0, y: 1, bgcolor: 'rgba(255,255,255,0.8)', font: { size: 11 } },
  };

  const traces = ['FOM', 'RB-ROM', 'ML-ROM'].map(model => ({
    x: [], y: [],
    mode: 'markers',
    type: 'scatter',
    name: model,
    marker: { color: MODEL_COLORS[model], size: 5 },
  }));

  Plotly.newPlot('timing-plot', traces, layout, { responsive: true });
}

function initSolutionPlot() {
  const layout = {
    title: { text: 'Solution', font: { size: 14 } },
    xaxis: { title: 'Spatial coordinate y' },
    yaxis: { title: 'Value' },
    margin: { t: 40, b: 50, l: 55, r: 20 },
    showlegend: true,
    legend: { x: 0, y: 1, bgcolor: 'rgba(255,255,255,0.8)', font: { size: 11 } },
  };

  const traces = [
    { x: [], y: [], mode: 'lines', name: 'State x(t)', line: { color: '#2980b9', width: 2 } },
    { x: [], y: [], mode: 'lines', name: 'Target x\u1d40', line: { color: '#e74c3c', width: 2, dash: 'dash' } },
    { x: [], y: [], mode: 'lines', name: 'Initial x\u2080', line: { color: '#95a5a6', width: 1, dash: 'dot' } },
  ];

  Plotly.newPlot('solution-plot', traces, layout, { responsive: true });
}

/**
 * Update parameter space plot with a new query result.
 */
export function updateParameterSpace(result, queryNum) {
  const modelIdx = { 'FOM': 0, 'RB-ROM': 1, 'ML-ROM': 2 }[result.model];
  Plotly.extendTraces('param-space-plot', {
    x: [[result.mu[0]]],
    y: [[result.mu[1]]],
  }, [modelIdx]);
}

/**
 * Update error estimate plot.
 * Shows ALL error estimates (ML-ROM and RB-ROM), even when the model
 * was not accurate enough and the hierarchy fell back to a slower model.
 * Tolerance line only extends from the query where it was set.
 */
export function updateErrorPlot(mlError, rbError, queryNum, tolerance) {
  if (mlError !== undefined && mlError > 0) {
    Plotly.extendTraces('error-plot', { x: [[queryNum]], y: [[mlError]] }, [0]);
  }
  if (rbError !== undefined && rbError > 0) {
    Plotly.extendTraces('error-plot', { x: [[queryNum]], y: [[rbError]] }, [1]);
  }

  // Track tolerance changes as separate line segments
  if (currentTolerance !== tolerance) {
    // Close previous segment
    if (currentTolerance !== null) {
      toleranceSegments.push({
        x0: currentToleranceStart, x1: queryNum - 0.5, y: currentTolerance,
      });
    }
    currentTolerance = tolerance;
    currentToleranceStart = queryNum - 0.5;
  }

  // Build shapes: completed segments + current open segment
  const shapes = toleranceSegments.map(seg => ({
    type: 'line', x0: seg.x0, x1: seg.x1, y0: seg.y, y1: seg.y,
    line: { color: '#e74c3c', width: 2, dash: 'dash' },
  }));
  // Current segment extends to current query
  shapes.push({
    type: 'line', x0: currentToleranceStart, x1: queryNum + 2,
    y0: tolerance, y1: tolerance,
    line: { color: '#e74c3c', width: 2, dash: 'dash' },
  });

  Plotly.relayout('error-plot', { shapes });
}

/**
 * Update timing plot.
 */
export function updateTimingPlot(result, queryNum) {
  const modelIdx = { 'FOM': 0, 'RB-ROM': 1, 'ML-ROM': 2 }[result.model];
  Plotly.extendTraces('timing-plot', {
    x: [[queryNum]], y: [[result.time]],
  }, [modelIdx]);
}

// Animation state
let animationId = null;

/**
 * Animate the state trajectory x(t) from t=0 to t=T.
 */
export function updateSolutionPlot(result, yGrid) {
  // Cancel any running animation
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  const yArr = Array.from(yGrid);
  const targetState = Array.from(result.xT);
  const initialState = Array.from(result.states[0]);
  const nt = result.states.length - 1;
  const titleBase = `\u03bc = [${result.mu[0].toFixed(2)}, ${result.mu[1].toFixed(2)}], ${result.model}`;

  // Compute y-axis range from all states + target
  let ymin = Infinity, ymax = -Infinity;
  for (let k = 0; k <= nt; k++) {
    const s = result.states[k];
    for (let i = 0; i < s.length; i++) {
      if (s[i] < ymin) ymin = s[i];
      if (s[i] > ymax) ymax = s[i];
    }
  }
  for (let i = 0; i < targetState.length; i++) {
    if (targetState[i] < ymin) ymin = targetState[i];
    if (targetState[i] > ymax) ymax = targetState[i];
  }
  const ypad = (ymax - ymin) * 0.1 || 0.1;

  // Number of animation frames (subsample time steps for smooth 60fps animation)
  const nFrames = 60;
  const dt_frame = nt / nFrames;
  let frame = 0;

  function drawFrame() {
    const k = Math.min(Math.round(frame * dt_frame), nt);
    const t = (k / nt * 0.1).toFixed(4);
    const stateAtK = Array.from(result.states[k]);

    Plotly.react('solution-plot', [
      { x: yArr, y: stateAtK, mode: 'lines', name: 'State x(t)', line: { color: '#2980b9', width: 2 } },
      { x: yArr, y: targetState, mode: 'lines', name: 'Target x\u1d40', line: { color: '#e74c3c', width: 2, dash: 'dash' } },
      { x: yArr, y: initialState, mode: 'lines', name: 'Initial x\u2080', line: { color: '#95a5a6', width: 1, dash: 'dot' } },
    ], {
      title: { text: `${titleBase}, t = ${t}`, font: { size: 14 } },
      xaxis: { title: 'Spatial coordinate y' },
      yaxis: { title: 'Value', range: [ymin - ypad, ymax + ypad] },
      margin: { t: 40, b: 50, l: 55, r: 20 },
      showlegend: true,
      legend: { x: 0, y: 1, bgcolor: 'rgba(255,255,255,0.8)', font: { size: 11 } },
    });

    frame++;
    if (frame <= nFrames) {
      animationId = requestAnimationFrame(drawFrame);
    } else {
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(drawFrame);
}

/**
 * Reset all plots.
 */
export function resetPlots() {
  initPlots();
}
