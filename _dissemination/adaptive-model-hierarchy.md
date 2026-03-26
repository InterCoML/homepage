---
layout: dissemination
title: "Interactive Adaptive Model Hierarchy for Parametric Optimal Control"
date: 2026-03-25
short-description: "An interactive demonstration of an adaptive model hierarchy combining reduced order models and machine learning surrogates to efficiently solve parametrized optimal control problems."
plotly: true
image: "model-hierarchy-preview.svg"
authors:
  - kleikamp
---

<p>
This interactive demo illustrates an adaptive model hierarchy for parametrized optimal control problems that is
described in more detail in
<a href="http://www.iam.fmph.uniba.sk/amuc/ojs/index.php/algoritmy/article/view/2145" target="_blank" class="link"><em>Application of an adaptive model hierarchy to parametrized optimal control problems</em></a>.
In this blog post we describe the background of the model hierarchy and the involved models.
In particular, we show how machine learning can interact with traditional approaches and accelerate computations
while ensuring certified accuracy.
</p>

<h2>Parametric optimal control problems</h2>

<p>
</p>

<h2>Adaptive model hierarchy</h2>

<p>
The hierarchy consists of three models of decreasing cost and accuracy:
</p>

<ol>
  <li><strong style="color:#c0392b">FOM</strong> (Full-Order Model) &mdash; exact solver using conjugate gradient iteration</li>
  <li><strong style="color:#e67e22">RB-ROM</strong> (Reduced Basis ROM) &mdash; projection onto a low-dimensional reduced basis</li>
  <li><strong style="color:#27ae60">ML-ROM</strong> (Machine Learning ROM) &mdash; kernel-based surrogate mapping parameters to reduced coefficients</li>
</ol>

<p>
When queried for a parameter $\mu\in\mathcal{P}$, the hierarchy first tries the fastest model (ML-ROM).
If the a posteriori error estimate exceeds the prescribed tolerance $\varepsilon$, it falls back to the RB-ROM, and finally to the FOM.
Every FOM solve enriches the reduced basis; every RB-ROM solve generates new training data for the ML-ROM.
The models are built adaptively &mdash; no offline phase is required.
<a href="https://epubs.siam.org/doi/10.1137/22M1493318" target="_blank" class="link"><em>A new certified hierarchical and adaptive RB-ML-ROM surrogate model for parametrized PDEs</em></a>
</p>

<div class="hierarchy-diagram">
  <div class="hierarchy-level hierarchy-mlrom">
    <div class="hierarchy-label">ML-ROM</div>
    <div class="hierarchy-desc">Machine Learning ROM<br><small>Kernel-based surrogate</small></div>
  </div>
  <div class="hierarchy-arrows">
    <span class="arrow-down" title="Fallback">&#9660; fallback</span>
    <span class="arrow-up" title="Generates training data">train &#9650;</span>
  </div>
  <div class="hierarchy-level hierarchy-rbrom">
    <div class="hierarchy-label">RB-ROM</div>
    <div class="hierarchy-desc">Reduced Basis ROM<br><small>Galerkin projection</small></div>
  </div>
  <div class="hierarchy-arrows">
    <span class="arrow-down" title="Fallback">&#9660; fallback</span>
    <span class="arrow-up" title="Enriches reduced basis">enrich &#9650;</span>
  </div>
  <div class="hierarchy-level hierarchy-fom">
    <div class="hierarchy-label">FOM</div>
    <div class="hierarchy-desc">Full-Order Model<br><small>Conjugate gradient solver</small></div>
  </div>
  <div class="hierarchy-caption">
    <span class="arrow-down">&#9660;</span> Error estimate exceeds tolerance $\varepsilon$
    &emsp;
    <span class="arrow-up">&#9650;</span> Model enrichment
  </div>
</div>

<p>
The following flowchart describes in more detail how the adaptive model hierarchy processes an incoming
parameter $\mu$. The parameter is first passed to the ML-ROM (the cheapest and least accurate in the hierarchy)
and the ML-ROM solution is computed. The error estimator of the ML-ROM is evaluated and the output compared
to the prescribed tolerance $\varepsilon$. If the estimated error is below the tolerance, the ML-ROM solution
is returned and none of the two other models has to be touched for the current parameter. If the estimated
error is too large, the next model in the hierarchy &mdash; the RB-ROM &mdash; is called next. The RB-ROM is solved and
its estimated error compared to the tolerance. If the RB-ROM solution is accurate enough, it is returned and
at the same time used for improving the ML-ROM. It the estimated error of the RB-ROM exceeds the tolerance,
the FOM is called. The solution of the FOM is returned (there is no accuracy check for the FOM required) and
used to improve the RB-ROM and consequently also the ML-ROM. It is important to note that the error estimation
ensures the accuracy of the solution delivered by the model hierarchy. In any case, the error of the model
hierarchy's output is smaller than the given tolerance. At the same time, computations are handled by the
faster models whenever possible and only when really necessary, more costly models are solved. Even when
models later in the hierarchy have to be called, this still generates training data for the other models
in the hierarchy, this way improving their performance as well.
</p>

<div class="flowchart">
  <div class="fc-node fc-input">Query $\mu$</div>
  <div class="fc-arrow"></div>
  <div class="fc-node fc-model fc-mlrom">Evaluate ML-ROM</div>
  <div class="fc-arrow"></div>
  <div class="fc-split fc-split-top">
    <div class="fc-split-decision">
      <div class="fc-node fc-decision"><span>Error $\leq \varepsilon$ ?</span></div>
    </div>
    <div class="fc-connector"></div>
    <div class="fc-split-arms">
      <div class="fc-arm fc-yes">
        <div class="fc-branch-label fc-label-yes">yes</div>
        <div class="fc-arrow"></div>
        <div class="fc-node fc-result fc-result-mlrom">Return ML-ROM solution</div>
      </div>
      <div class="fc-arm fc-no">
        <div class="fc-branch-label fc-label-no">no</div>
        <div class="fc-arrow"></div>
        <div class="fc-node fc-model fc-rbrom">Evaluate RB-ROM</div>
        <div class="fc-arrow"></div>
        <div class="fc-split fc-split-bottom">
          <div class="fc-split-decision">
            <div class="fc-node fc-decision"><span>Error $\leq \varepsilon$ ?</span></div>
          </div>
          <div class="fc-connector"></div>
          <div class="fc-split-arms">
            <div class="fc-arm fc-yes">
              <div class="fc-branch-label fc-label-yes">yes</div>
              <div class="fc-arrow"></div>
              <div class="fc-node fc-enrich">Train ML-ROM</div>
              <div class="fc-arrow"></div>
              <div class="fc-node fc-result fc-result-rbrom">Return RB-ROM solution</div>
            </div>
            <div class="fc-arm fc-no">
              <div class="fc-branch-label fc-label-no">no</div>
              <div class="fc-arrow"></div>
              <div class="fc-node fc-model fc-fom">Solve FOM</div>
              <div class="fc-arrow"></div>
              <div class="fc-node fc-enrich">Enrich RB + Train ML-ROM</div>
              <div class="fc-arrow"></div>
              <div class="fc-node fc-result fc-result-fom">Return FOM solution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<p>
The following plot shows how a typical sequence of queries of the adaptive model hierarchy compares
to querying the FOM or a general ROM in terms of computational costs. Typically, ROMs are built within
an expensive offline phase and applied afterwards during the so-called online phase. The costs for evaluating
the ROM during the online phase are usually much smaller than evaluating the FOM. The computational costs
are therefore split into a costly offline phase and cheap evaluations online for unseen parameters. In contrast,
the FOM does not have an offline phase but every solve of the FOM is costly on its own. The adaptive hierarchy
also does not require an offline phase. However, some of the queries might lead to a higher computational effort
due to the evaluation of more costly models in the hierarchy and potential updates or training of the cheaper models.
The plot below shows an example for the computational time with respect to the number of queried parameters
for the three scenarios discussed here.
</p>

<div id="cost-comparison-plot" style="max-width:700px; margin:2rem auto;"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  // Schematic computation time vs number of parameter samples
  var n = [];
  for (var i = 0; i <= 200; i++) n.push(i);

  // FOM: linear growth starting from 0
  var fom = n.map(function (x) { return 0.5 * x; });

  // ROM with offline phase: expensive offline ramp, then cheap online
  var offlineN = [];
  var offlineCost = [];
  for (var i = -40; i <= 0; i++) {
    offlineN.push(i);
    offlineCost.push(0.875 * (i + 40)); // ramp from 0 during offline
  }
  var romN = offlineN.concat(n);
  var romCost = offlineCost.concat(n.map(function (x) { return 35 + 0.05 * x; }));

  // Adaptive hierarchy: mostly cheap but occasional costly FOM/RB solves
  var adaptiveCum = 0;
  var adaptive = n.map(function (x) {
    if (x === 0) { adaptiveCum = 0; return 0; }
    // Occasional expensive solves (FOM fallbacks) that become rarer over time
    var baseCost = 0.06;
    var spike = 0;
    if (x < 15) {
      spike = 0.4; // early: mostly FOM solves
    } else if (x < 40) {
      spike = (x % 3 === 0) ? 0.3 : 0.08; // mix of RB-ROM and FOM
    } else if (x >= 50 && x < 60) {
      spike = 0.3; // new region: re-adaptation needed
    } else if (x >= 60 && x < 70) {
      spike = (x % 3 === 0) ? 0.2 : 0.07; // settling again
    } else if (x < 80) {
      spike = (x % 8 === 0) ? 0.25 : 0.06; // occasional FOM fallback
    } else if (x >= 125 && x < 140) {
      spike = 0.35; // new region: models need re-adaptation
    } else if (x >= 140 && x < 155) {
      spike = (x % 3 === 0) ? 0.25 : 0.08; // settling again
    } else {
      spike = (x % 20 === 0) ? 0.2 : baseCost; // rare FOM fallback
    }
    adaptiveCum += spike;
    return adaptiveCum;
  });

  var traces = [
    {
      x: n, y: fom, name: "FOM",
      line: { color: "#c0392b", width: 3 },
      mode: "lines"
    },
    {
      x: romN, y: romCost, name: "ROM (offline-online)",
      line: { color: "#182f4c", width: 3 },
      mode: "lines"
    },
    {
      x: n, y: adaptive, name: "Adaptive model hierarchy",
      line: { color: "#27ae60", width: 3 },
      mode: "lines"
    }
  ];

  var layout = {
    xaxis: {
      title: "Number of parameter samples",
      zeroline: true,
      showgrid: false,
      range: [-45, 205]
    },
    yaxis: {
      title: "Computation time",
      showticklabels: false,
      zeroline: true,
      showgrid: false
    },
    legend: { x: 0.02, y: 0.98 },
    margin: { t: 20, r: 20 },
    shapes: [
      // Hatched area indicator for offline phase
      {
        type: "rect",
        x0: -40, x1: 0, y0: 0, y1: 50,
        fillcolor: "rgba(24,47,76,0.08)",
        line: { color: "rgba(24,47,76,0.3)", dash: "dot" }
      }
    ],
    annotations: [
      {
        x: -20, y: 47,
        text: "Offline phase",
        showarrow: false,
        font: { size: 12, color: "#182f4c" }
      }
    ]
  };

  Plotly.newPlot("cost-comparison-plot", traces, layout, { responsive: true, displayModeBar: false });
});
</script>

<h2>Reduced basis reduced order model</h2>

<p>
Before moving to the machine learning surrogate, we briefly summarize the main ideas of reduced basis
reduced order models. The particular reduced model applied in the interactive demo was introduced in
<a href="https://www.sciencedirect.com/science/article/abs/pii/S0005109816303338" target="_blank" class="link"><em>Greedy controllability of finite dimensional linear systems</em></a>.
Here, we describe projection-based reduced models for parametric problems in a more general manner:
</p>
<p>
Consider a problem with a parameter-dependency in the underlying system, such that also the solutions
vary with the parameter. Assume further that the solutions live in a high-dimensional space. In many cases,
although the solutions are parameter-dependent, they do not change arbitrary but depend smoothly
in some way on the parameter. The smoothness of the dependency can be exploitet by extracting a low-dimensional
subspace that covers the main variety of the solutions. Therefore, instead of solving in the original
high-dimensional space, we restrict ourselves to a suitable low-dimensional subspace and solve within
that subspace. This leads to an approximate solution which can be represented as a linear combination
of a basis of the subspace &mdash; the so-called reduced basis. Solving in the reduced space is, when done
properly, much faster than solving the original problem. The major computational effort is required
when computing the reduced basis itself. This is usually done based on some solutions of the high-dimensional
problem. Within the adaptive model hierarchy, high-dimensional solution data is available whenever
the full-order model is called. We further note that the reduced model used here allows for an error
estimator that can be evaluated efficiently. Given a new parameter, we just need to solve in the
subspace spanned by the reduced basis and, based on the approximate solution, compute an upper bound
for the error with respect to the high-dimensional solution. This error estimate does in particular not
require the high-dimensional solution itself and can be computed with a similar computational effort
than solving in the subspace.
</p>

<h2>Kernel interpolation as machine learning surrogate</h2>

<a href="https://www.esaim-m2an.org/articles/m2an/abs/2025/01/m2an230202/m2an230202.html" target="_blank" class="link"><em>Be greedy and learn: efficient and certified algorithms for parametrized optimal control problems</em></a>
<p>
The ML-ROM approximates the map from parameters to reduced coefficients using kernel interpolation.
Given training data $\{(\mu_i, \alpha_i)\}$, the interpolant is a weighted sum of kernel functions centered at each training point:
$$s(\mu) = \sum_{i=1}^{M} w_i \, k(\mu, \mu_i)$$
where $k$ is a kernel function (e.g., a Gaussian $k(\mu, \mu') = \exp(-\gamma \|\mu - \mu'\|^2)$).
Click on the plot below to add training points and see how the interpolation is built from individual kernels.
</p>

<div class="kernel-demo-controls" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
  <label style="font-size:0.9em; color:#182f4c; font-weight:bold;">Kernel width $\gamma$: <span id="gamma-value" style="display:inline-block; width:2.5em; text-align:right;">10.0</span></label>
  <input type="range" id="gamma-slider" min="1" max="50" step="0.1" value="10" style="width:250px; accent-color:#182f4c;">
  <button id="kernel-reset" class="button" style="font-size:0.8em; padding:5px 12px;">Reset</button>
  <label style="font-size:0.85em;">
    <input type="checkbox" id="show-kernels" checked> Show individual kernels
  </label>
</div>

<div id="kernel-interpolation-plot" style="max-width:700px; margin:0 auto 2rem;"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  var gamma = 10.0;
  var points = [];
  var targetFn = function (x) { return Math.sin(2.5 * x) + 0.5 * Math.cos(4 * x); };
  var plotDiv = document.getElementById("kernel-interpolation-plot");
  var initialized = false;

  // x grid for plotting
  var xGrid = [];
  for (var i = 0; i <= 200; i++) xGrid.push(i / 200 * 4 - 0.5);
  var targetY = xGrid.map(targetFn);

  var kernelColors = [
    "#e74c3c", "#3498db", "#e67e22", "#9b59b6", "#1abc9c",
    "#f39c12", "#2980b9", "#d35400", "#8e44ad", "#16a085"
  ];

  function gaussianKernel(x, c, g) {
    return Math.exp(-g * (x - c) * (x - c));
  }

  function solveWeights(pts, g) {
    var n = pts.length;
    if (n === 0) return [];
    // Build augmented kernel matrix [K | y]
    var K = [];
    for (var i = 0; i < n; i++) {
      K[i] = new Array(n + 1);
      for (var j = 0; j < n; j++) {
        K[i][j] = gaussianKernel(pts[i].x, pts[j].x, g);
      }
      K[i][n] = pts[i].y;
    }
    // Gaussian elimination with partial pivoting
    for (var col = 0; col < n; col++) {
      var maxRow = col;
      for (var row = col + 1; row < n; row++) {
        if (Math.abs(K[row][col]) > Math.abs(K[maxRow][col])) maxRow = row;
      }
      var tmp = K[col]; K[col] = K[maxRow]; K[maxRow] = tmp;
      if (Math.abs(K[col][col]) < 1e-12) continue;
      for (var row = col + 1; row < n; row++) {
        var f = K[row][col] / K[col][col];
        for (var j = col; j <= n; j++) K[row][j] -= f * K[col][j];
      }
    }
    // Back substitution
    var w = new Array(n);
    for (var i = n - 1; i >= 0; i--) {
      w[i] = K[i][n];
      for (var j = i + 1; j < n; j++) w[i] -= K[i][j] * w[j];
      w[i] /= K[i][i];
    }
    return w;
  }

  function updatePlot() {
    var showKernels = document.getElementById("show-kernels").checked;
    var weights = solveWeights(points, gamma);
    var traces = [];

    // Target function
    traces.push({
      x: xGrid, y: targetY, name: "Target function",
      line: { color: "#babbbd", width: 2, dash: "dash" },
      mode: "lines"
    });

    // Individual weighted kernels
    if (showKernels) {
      for (var i = 0; i < points.length; i++) {
        (function (idx) {
          var ki = xGrid.map(function (x) {
            return weights[idx] * gaussianKernel(x, points[idx].x, gamma);
          });
          traces.push({
            x: xGrid, y: ki,
            showlegend: false,
            line: { width: 1.5, dash: "dot", color: kernelColors[idx % kernelColors.length] },
            mode: "lines",
            opacity: 0.7
          });
        })(i);
      }
    }

    // Interpolant
    if (points.length > 0) {
      var interp = xGrid.map(function (x) {
        var s = 0;
        for (var i = 0; i < points.length; i++) {
          s += weights[i] * gaussianKernel(x, points[i].x, gamma);
        }
        return s;
      });
      traces.push({
        x: xGrid, y: interp, name: "Interpolant s(μ)",
        line: { color: "#27ae60", width: 3 },
        mode: "lines"
      });
    }

    // Training points with colored markers matching kernel colors
    if (points.length > 0) {
      traces.push({
        x: points.map(function (p) { return p.x; }),
        y: points.map(function (p) { return p.y; }),
        name: "Training points",
        mode: "markers",
        marker: {
          color: points.map(function (_, i) { return kernelColors[i % kernelColors.length]; }),
          size: 12,
          line: { color: "white", width: 2 }
        }
      });
    }

    var layout = {
      xaxis: { title: "μ", showgrid: true, gridcolor: "#eee", range: [-0.5, 3.5] },
      yaxis: { title: "f(μ)", showgrid: true, gridcolor: "#eee", range: [-2.5, 2.5] },
      showlegend: true,
      legend: { x: 0.02, y: 0.98, font: { size: 11 } },
      margin: { t: 20, r: 20 },
      hovermode: "closest"
    };

    if (!initialized) {
      Plotly.newPlot(plotDiv, traces, layout, {
        responsive: true,
        modeBarButtonsToRemove: ["select2d", "lasso2d", "toImage", "sendDataToCloud"],
        displaylogo: false
      });
      initialized = true;
    } else {
      Plotly.react(plotDiv, traces, layout);
    }
  }

  // Initial plot
  updatePlot();

  // Click handler: add point at clicked position on target function
  plotDiv.on("plotly_click", function (data) {
    if (data.points && data.points[0]) {
      var x = data.points[0].x;
      // Snap y to target function value
      var y = targetFn(x);
      points.push({ x: x, y: y });
      updatePlot();
    }
  });

  // Gamma slider
  document.getElementById("gamma-slider").addEventListener("input", function () {
    gamma = parseFloat(this.value);
    document.getElementById("gamma-value").textContent = gamma.toFixed(1);
    updatePlot();
  });

  // Show kernels toggle
  document.getElementById("show-kernels").addEventListener("change", updatePlot);

  // Reset button
  document.getElementById("kernel-reset").addEventListener("click", function () {
    points = [];
    updatePlot();
  });
});
</script>

<p>
For the ML-ROM, we are actually not restricted to kernel methods. Any machine learning method capable
of approximating vector-valued input-output data in a supervised learning setting can be used.
The approach has for instance been tested with deep neural networks and Gaussian process regression as well.
</p>

<h2>Interactive demo</h2>

<p>
We are now set to show the interactive demo for the hierarchy including the models presented above.
To this end, we consider a parametric optimal control problem that is briefly described in the following.
</p>
<p>
The test problem is a parametrized 1D heat equation on the spatial domain $\Omega = [0,1]$ with two boundary controls,
where $\mu_1 \in [1,2]$ is the diffusivity and $\mu_2 \in [0.5, 1.5]$ determines the slope of the target state.
The demo below allows to query the hierarchy either by selecting specific parameters using the sliders,
by clicking inside of the parameter space box or by drawing random samples.
It is further possible to query the hierarchy for a whole batch of random parameters.
The results obtained by the adaptive model hierarchy are shown in the table below and the respective plots.
As before, the different colors refer to the three models involved here.
Besides the selected parameters, there are plots showing the estimated errors and the required time to process each query.
The last plot displays an animation of the solution computed for the selected parameter.
<br />
<b>Feel free to try the hierarchy on your own with this interactive demo!</b>
</p>

<div class="model-hierarchy-demo">

  <div class="demo-controls">
    <div class="control-group">
      <label>$\mu_1$ (diffusivity): <span id="mu1-value">1.50</span></label>
      <input type="range" id="mu1-slider" min="1.0" max="2.0" step="0.01" value="1.50">
    </div>
    <div class="control-group">
      <label>$\mu_2$ (target slope): <span id="mu2-value">1.00</span></label>
      <input type="range" id="mu2-slider" min="0.5" max="1.5" step="0.01" value="1.00">
    </div>
    <div class="control-group">
      <label>Tolerance $\varepsilon$:</label>
      <input type="text" id="tolerance" value="1e-3" style="width:80px">
    </div>
    <div class="control-group demo-buttons">
      <button id="btn-query" class="button">Query Single</button>
      <button id="btn-random" class="button">Random Query</button>
      <button id="btn-batch" class="button">Run Batch</button>
      <button id="btn-reset" class="button button-secondary">Reset</button>
      <label style="font-size:0.85em">Batch size:
        <input type="number" id="batch-size" value="200" min="10" max="2000" style="width:70px">
      </label>
    </div>
  </div>

  <div class="demo-stats" id="demo-stats">
    <h4>Statistics</h4>
    <table class="stats-table">
      <tr><td>Total queries:</td><td id="stat-total">0</td><td></td></tr>
      <tr><td style="color:#c0392b">FOM calls:</td><td id="stat-fom">0</td><td>avg <span id="stat-avg-fom">-</span> ms</td></tr>
      <tr><td style="color:#e67e22">RB-ROM calls:</td><td id="stat-rbrom">0</td><td>avg <span id="stat-avg-rbrom">-</span> ms</td></tr>
      <tr><td style="color:#27ae60">ML-ROM calls:</td><td id="stat-mlrom">0</td><td>avg <span id="stat-avg-mlrom">-</span> ms</td></tr>
      <tr><td>Basis size:</td><td id="stat-basis">0</td><td></td></tr>
      <tr><td>ML training samples:</td><td id="stat-ml-samples">0</td><td></td></tr>
      <tr><td>RB basis extension:</td><td id="stat-rb-build-time" colspan="2">-</td></tr>
      <tr><td>ML training:</td><td id="stat-ml-train-time" colspan="2">-</td></tr>
    </table>
    <div id="last-result"><em>No queries yet</em></div>
  </div>

  <div class="demo-plots">
    <div class="plot-row">
      <div id="param-space-plot" class="demo-plot"></div>
      <div id="error-plot" class="demo-plot"></div>
    </div>
    <div class="plot-row">
      <div id="timing-plot" class="demo-plot"></div>
      <div id="solution-plot" class="demo-plot"></div>
    </div>
  </div>

</div>

<script type="module" src="{{ site.baseUrl }}/assets/js/model-hierarchy/main.js"></script>
