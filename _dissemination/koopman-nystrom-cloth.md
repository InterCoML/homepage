---
layout: dissemination
title: "Controlling a Cloth with Koopman Operators and the Nystr&ouml;m Method"
date: 2026-04-07
short-description: "An interactive exploration of how Koopman operator theory combined with the Nystr&ouml;m method enables linear control of nonlinear systems, demonstrated on a cloth manipulation task."
plotly: true
image: "koopman-cloth-preview.svg"
authors:
  - caldarelli
  - molinari
---

<p>
This blog post provides an interactive introduction to the ideas presented in
<a href="https://doi.org/10.1016/j.automatica.2025.112302" target="_blank" class="link"><em>Linear quadratic control of nonlinear systems with Koopman operator learning and the Nystr&ouml;m method</em></a>,
published in Automatica (2025).
The key idea is remarkably elegant: by lifting a nonlinear dynamical system into a higher-dimensional
space using the Koopman operator, the dynamics become linear. Once linear, powerful and well-understood
control techniques such as the Linear Quadratic Regulator (LQR) can be applied directly.
The Nystr&ouml;m method makes this approach computationally tractable by approximating the
infinite-dimensional lifting with a finite number of kernel evaluations.
</p>

<h2>From nonlinear to linear: the Koopman operator</h2>

<p>
Many real-world systems &mdash; from robotic arms to deformable objects like cloth &mdash; are governed
by nonlinear dynamics of the form
$$\mathbf{x}_{k+1} = f(\mathbf{x}_k, \mathbf{u}_k),$$
where $\mathbf{x}_k$ is the state and $\mathbf{u}_k$ is the control input. Designing controllers for
such systems is challenging because the nonlinearity makes it difficult to predict how the system
will evolve and to compute optimal control strategies.
</p>

<p>
The Koopman operator offers a way out. Instead of working with the state $\mathbf{x}$ directly, we
apply a set of nonlinear functions $\psi(\mathbf{x})$ &mdash; called <em>observables</em> &mdash;
that lift the state into a higher-dimensional (potentially infinite-dimensional) space. In this
lifted space, the dynamics become <em>linear</em>:
$$z_{k+1} = A_\gamma z_k + B_\gamma \mathbf{u}_k,$$
where $z_k = \psi(\mathbf{x}_k)$ is the lifted state. The key insight is that while $f$ is nonlinear,
the evolution of the observables under $f$ is governed by a linear operator &mdash; the Koopman operator.
</p>

<p>
The interactive plot below illustrates this concept. Consider a simple nonlinear system
$x_{k+1} = x_k - 0.2\,x_k^3 + u_k$. In the original state space, trajectories curve due to the
cubic nonlinearity. But when we lift the state using observable functions (here: $\psi(x) = [x, x^2, x^3]$),
the dynamics in the lifted space are approximately linear. Try adjusting the initial state and the
control input to see how both representations evolve.
</p>

<div class="koopman-demo-controls" style="display:flex; gap:15px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
  <label style="font-size:0.9em; color:#182f4c; font-weight:bold;">
    Initial state $x_0$: <span id="koopman-x0-value" style="display:inline-block; width:2.5em; text-align:right;">0.80</span>
  </label>
  <input type="range" id="koopman-x0-slider" min="-1.5" max="1.5" step="0.01" value="0.8" style="width:180px; accent-color:#182f4c;">
  <label style="font-size:0.9em; color:#182f4c; font-weight:bold;">
    Control $u$: <span id="koopman-u-value" style="display:inline-block; width:2.5em; text-align:right;">0.00</span>
  </label>
  <input type="range" id="koopman-u-slider" min="-0.5" max="0.5" step="0.01" value="0" style="width:180px; accent-color:#182f4c;">
</div>

<div style="display:flex; gap:10px; flex-wrap:wrap;">
  <div id="koopman-original-plot" style="flex:1; min-width:300px; min-height:300px;"></div>
  <div id="koopman-lifted-plot" style="flex:1; min-width:300px; min-height:300px;"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  var x0 = 0.8, uConst = 0.0;
  var T = 30;

  function simulate(x0val, u) {
    var xs = [x0val];
    for (var k = 0; k < T; k++) {
      var x = xs[k];
      xs.push(x - 0.2 * x * x * x + u);
    }
    return xs;
  }

  function updateKoopman() {
    var xs = simulate(x0, uConst);
    var steps = [];
    for (var i = 0; i <= T; i++) steps.push(i);

    // Lifted observables
    var z1 = xs.map(function (x) { return x; });
    var z2 = xs.map(function (x) { return x * x; });
    var z3 = xs.map(function (x) { return x * x * x; });

    // Original space plot
    Plotly.react("koopman-original-plot", [
      { x: steps, y: xs, name: "x(k)", line: { color: "#c0392b", width: 3 }, mode: "lines+markers", marker: { size: 4 } }
    ], {
      title: { text: "Original (nonlinear) state space", font: { size: 14 } },
      xaxis: { title: "Step k" },
      yaxis: { title: "x", range: [-2, 2] },
      margin: { t: 40, r: 10 },
      showlegend: false,
    }, { responsive: true, displayModeBar: false });

    // Lifted space plot
    Plotly.react("koopman-lifted-plot", [
      { x: steps, y: z1, name: "\u03C8\u2081 = x", line: { color: "#27ae60", width: 2 }, mode: "lines" },
      { x: steps, y: z2, name: "\u03C8\u2082 = x\u00B2", line: { color: "#e67e22", width: 2 }, mode: "lines" },
      { x: steps, y: z3, name: "\u03C8\u2083 = x\u00B3", line: { color: "#3498db", width: 2 }, mode: "lines" },
    ], {
      title: { text: "Lifted (Koopman) space", font: { size: 14 } },
      xaxis: { title: "Step k" },
      yaxis: { title: "Observables \u03C8(x)", range: [-3, 3] },
      margin: { t: 40, r: 10 },
      legend: { x: 0.7, y: 0.98 },
    }, { responsive: true, displayModeBar: false });
  }

  document.getElementById("koopman-x0-slider").addEventListener("input", function () {
    x0 = parseFloat(this.value);
    document.getElementById("koopman-x0-value").textContent = x0.toFixed(2);
    updateKoopman();
  });
  document.getElementById("koopman-u-slider").addEventListener("input", function () {
    uConst = parseFloat(this.value);
    document.getElementById("koopman-u-value").textContent = uConst.toFixed(2);
    updateKoopman();
  });

  updateKoopman();
});
</script>

<h2>The Nystr&ouml;m approximation</h2>

<p>
In practice, the Koopman lifting uses kernel functions to map the state into a reproducing
kernel Hilbert space (RKHS). The lifting function is defined using a kernel
$k(\mathbf{x}, \mathbf{x}') = \exp(-\gamma \|\mathbf{x} - \mathbf{x}'\|^2)$,
which in principle lives in an infinite-dimensional space. To make computations tractable,
the <em>Nystr&ouml;m method</em> approximates this infinite-dimensional representation using
a finite set of $m$ landmark points $\bar{\mathbf{x}}_1, \ldots, \bar{\mathbf{x}}_m$ sampled
from the training data:
$$\psi(\mathbf{x}) \approx \tilde{\psi}(\mathbf{x}) = K_{m}^{-1/2} [k(\mathbf{x}, \bar{\mathbf{x}}_1), \ldots, k(\mathbf{x}, \bar{\mathbf{x}}_m)]^\top.$$
This reduces the problem from infinite dimensions to $m$ dimensions, where $m$ can be chosen
to balance accuracy and computational cost. The more landmarks, the better the approximation
&mdash; but even a modest number can yield excellent results, as the paper proves theoretically.
</p>

<p>
The plot below illustrates this trade-off. It shows the approximation quality of a kernel matrix
using an increasing number of Nystr&ouml;m landmarks $m$ sampled from a set of data points.
As $m$ grows, the approximation error decreases, recovering the full kernel matrix.
</p>

<div class="nystrom-controls" style="display:flex; gap:15px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
  <label style="font-size:0.9em; color:#182f4c; font-weight:bold;">
    Landmarks $m$: <span id="nystrom-m-value" style="display:inline-block; width:2em; text-align:right;">10</span>
  </label>
  <input type="range" id="nystrom-m-slider" min="2" max="30" step="1" value="10" style="width:200px; accent-color:#182f4c;">
  <button id="nystrom-resample" class="button" style="font-size:0.8em; padding:5px 12px;">Resample</button>
</div>

<div style="display:flex; gap:10px; flex-wrap:wrap;">
  <div id="nystrom-full-plot" style="flex:1; min-width:250px; height:300px;"></div>
  <div id="nystrom-approx-plot" style="flex:1; min-width:250px; height:300px;"></div>
  <div id="nystrom-error-plot" style="flex:1; min-width:250px; height:300px;"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  var N = 30;
  var gamma = 2.0;
  var dataPoints = [];
  var mLandmarks = 10;

  function generateData() {
    dataPoints = [];
    for (var i = 0; i < N; i++) {
      dataPoints.push(Math.random() * 2 - 1);
    }
    dataPoints.sort(function (a, b) { return a - b; });
  }

  function rbfKernel(x1, x2) {
    var d = x1 - x2;
    return Math.exp(-gamma * d * d);
  }

  function computeKernelMatrix(pts) {
    var n = pts.length;
    var K = [];
    for (var i = 0; i < n; i++) {
      K[i] = [];
      for (var j = 0; j < n; j++) {
        K[i][j] = rbfKernel(pts[i], pts[j]);
      }
    }
    return K;
  }

  function nystromApprox(K, m) {
    // Simple Nystrom: use first m points as landmarks
    // K_approx = K_nm * K_mm^{-1} * K_mn
    var n = K.length;
    var Kmm = [];
    for (var i = 0; i < m; i++) {
      Kmm[i] = [];
      for (var j = 0; j < m; j++) {
        Kmm[i][j] = K[i][j];
      }
    }

    // Invert Kmm via Cholesky-like approach (add small regularization)
    for (var i = 0; i < m; i++) Kmm[i][i] += 1e-6;

    // Simple Gaussian elimination for inverse
    var Kinv = [];
    for (var i = 0; i < m; i++) {
      Kinv[i] = new Array(m).fill(0);
      Kinv[i][i] = 1;
    }
    var A = Kmm.map(function (row) { return row.slice(); });
    for (var col = 0; col < m; col++) {
      var pivot = A[col][col];
      for (var j = 0; j < m; j++) { A[col][j] /= pivot; Kinv[col][j] /= pivot; }
      for (var row = 0; row < m; row++) {
        if (row === col) continue;
        var f = A[row][col];
        for (var j = 0; j < m; j++) { A[row][j] -= f * A[col][j]; Kinv[row][j] -= f * Kinv[col][j]; }
      }
    }

    // K_nm
    var Knm = [];
    for (var i = 0; i < n; i++) {
      Knm[i] = [];
      for (var j = 0; j < m; j++) {
        Knm[i][j] = K[i][j];
      }
    }

    // K_approx = Knm * Kinv * Knm^T
    var Kapprox = [];
    for (var i = 0; i < n; i++) {
      Kapprox[i] = [];
      // Knm * Kinv row
      var tmp = new Array(m).fill(0);
      for (var j = 0; j < m; j++) {
        for (var k = 0; k < m; k++) {
          tmp[j] += Knm[i][k] * Kinv[k][j];
        }
      }
      for (var j = 0; j < n; j++) {
        var val = 0;
        for (var k = 0; k < m; k++) {
          val += tmp[k] * Knm[j][k];
        }
        Kapprox[i][j] = val;
      }
    }

    return Kapprox;
  }

  function matToHeatmap(mat, title) {
    return {
      z: mat, type: "heatmap", colorscale: "Viridis",
      showscale: false, zmin: 0, zmax: 1,
    };
  }

  function frobeniusError(K1, K2) {
    var n = K1.length, err = 0, norm = 0;
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        var d = K1[i][j] - K2[i][j];
        err += d * d;
        norm += K1[i][j] * K1[i][j];
      }
    }
    return Math.sqrt(err) / Math.sqrt(norm);
  }

  function updateNystrom() {
    var K = computeKernelMatrix(dataPoints);
    var Kapprox = nystromApprox(K, mLandmarks);
    var relErr = frobeniusError(K, Kapprox);

    var layout = { margin: { t: 40, l: 30, r: 10, b: 30 } };

    Plotly.react("nystrom-full-plot", [matToHeatmap(K)], Object.assign({}, layout, {
      title: { text: "Full kernel matrix K", font: { size: 13 } },
    }), { responsive: true, displayModeBar: false });

    Plotly.react("nystrom-approx-plot", [matToHeatmap(Kapprox)], Object.assign({}, layout, {
      title: { text: "Nystr\u00f6m approx. (m=" + mLandmarks + ")", font: { size: 13 } },
    }), { responsive: true, displayModeBar: false });

    // Error matrix
    var Kerr = [];
    for (var i = 0; i < N; i++) {
      Kerr[i] = [];
      for (var j = 0; j < N; j++) {
        Kerr[i][j] = Math.abs(K[i][j] - Kapprox[i][j]);
      }
    }
    Plotly.react("nystrom-error-plot", [{
      z: Kerr, type: "heatmap", colorscale: "Reds",
      showscale: false, zmin: 0, zmax: 0.5,
    }], Object.assign({}, layout, {
      title: { text: "Error (rel. " + (relErr * 100).toFixed(1) + "%)", font: { size: 13 } },
    }), { responsive: true, displayModeBar: false });
  }

  document.getElementById("nystrom-m-slider").addEventListener("input", function () {
    mLandmarks = parseInt(this.value);
    document.getElementById("nystrom-m-value").textContent = mLandmarks;
    updateNystrom();
  });

  document.getElementById("nystrom-resample").addEventListener("click", function () {
    generateData();
    updateNystrom();
  });

  generateData();
  updateNystrom();
});
</script>

<h2>The control pipeline</h2>

<p>
The overall pipeline for controlling a nonlinear system using Koopman operators consists of three steps:
</p>
<ol>
  <li><strong>Data collection:</strong> Record trajectories of the system under various control inputs.</li>
  <li><strong>System identification:</strong> Use the Nystr&ouml;m method to learn a finite-dimensional
      linear model $\hat{z}_{k+1} = \hat{A}\hat{z}_k + \hat{B}\mathbf{u}_k$ from the data,
      where $\hat{z}$ lives in an $m$-dimensional space.</li>
  <li><strong>LQR control:</strong> Solve the discrete algebraic Riccati equation for the learned
      linear system to obtain an optimal state-feedback gain $K_{\text{lqr}}$.
      The control law becomes $\mathbf{u}_k = K_{\text{lqr}} \hat{z}_k$.</li>
</ol>

<div class="hierarchy-diagram">
  <div class="hierarchy-level" style="background-color:#c0392b;">
    <div class="hierarchy-label">Step 1</div>
    <div class="hierarchy-desc">Data Collection<br><small>Record state-control trajectories</small></div>
  </div>
  <div class="hierarchy-arrows">
    <span class="arrow-down">&#9660; training data</span>
  </div>
  <div class="hierarchy-level" style="background-color:#e67e22;">
    <div class="hierarchy-label">Step 2</div>
    <div class="hierarchy-desc">Nystr&ouml;m-Koopman Identification<br><small>Learn linear model $\hat{A}, \hat{B}$ in lifted space</small></div>
  </div>
  <div class="hierarchy-arrows">
    <span class="arrow-down">&#9660; linear system matrices</span>
  </div>
  <div class="hierarchy-level" style="background-color:#27ae60;">
    <div class="hierarchy-label">Step 3</div>
    <div class="hierarchy-desc">LQR Design<br><small>Solve Riccati equation for optimal gain $K_{\text{lqr}}$</small></div>
  </div>
  <div class="hierarchy-caption" style="margin-top:0.5rem;">
    The resulting control law is $\mathbf{u}_k = K_{\text{lqr}} \tilde{\psi}(\mathbf{x}_k)$
  </div>
</div>

<p>
A key contribution of the paper is proving that the Nystr&ouml;m approximation error propagates
gracefully through this pipeline. Specifically, as the number of landmarks $m$ increases, the
learned operators $\hat{A}$ and $\hat{B}$ converge to the exact Koopman operators,
the Riccati solution converges, and consequently the LQR cost converges to the optimal value.
</p>

<h2>Application: cloth manipulation</h2>

<p>
As a challenging test case, the paper applies this approach to controlling a deformable cloth.
The cloth is modeled as an $8 \times 8$ mesh of nodes subject to gravity, inextensibility constraints,
and damping. Two upper corners are actuated &mdash; the control input consists of the 6 degrees of
freedom (3D position changes) of these two corners. The full state of the cloth lives in
$\mathbb{R}^{192}$ (64 nodes &times; 3 coordinates), making this a high-dimensional nonlinear control problem.
</p>

<p>
The goal is to swing the cloth from its resting configuration to a target pose rotated by 45&deg;.
The Koopman approach identifies a linear model from training trajectories, then LQR computes
the optimal feedback gain. The paper shows that the Nystr&ouml;m-based features outperform
spline-based features in terms of regulation error and running cost.
</p>

<p>
The interactive simulation below shows a simplified version of this task. The cloth hangs from
two actuated corners (red dots). Click "Apply Koopman-LQR Control" to see the corners move the cloth
toward the target configuration (shown as a red wireframe). You can drag the canvas to rotate the view.
</p>

<div style="text-align:center; margin:1rem 0;">
  <canvas id="cloth-canvas" width="600" height="450" style="border:2px solid #182f4c; border-radius:8px; cursor:grab; max-width:100%;"></canvas>
</div>

<div style="display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap; margin-bottom:1rem;">
  <button id="btn-cloth-control" class="button" style="font-size:0.9em;">Apply Koopman-LQR Control</button>
  <button id="btn-cloth-reset" class="button button-secondary" style="font-size:0.9em;">Reset</button>
  <label style="font-size:0.85em;">
    <input type="checkbox" id="chk-show-target" checked> Show target
  </label>
  <span style="font-size:0.9em; color:#182f4c;">
    RMSE: <strong id="cloth-rmse">-</strong>
  </span>
</div>

<script src="{{ site.baseUrl }}/assets/js/koopman-cloth/cloth-sim.js"></script>

<h2>Conclusion</h2>
<p>
The combination of Koopman operator theory with the Nystr&ouml;m method provides an elegant and
principled approach for controlling nonlinear dynamical systems. By lifting the state space using
kernel functions and approximating this lifting with a finite number of landmarks, the resulting
linear system can be controlled using standard LQR techniques with provable approximation guarantees.
The cloth manipulation example demonstrates that this approach scales to high-dimensional,
physically realistic problems. For more details, including the full theoretical analysis and
additional numerical experiments, we refer to the
<a href="https://doi.org/10.1016/j.automatica.2025.112302" target="_blank" class="link">full paper</a>
and the
<a href="https://github.com/LCSL/nys-koop-lqr" target="_blank" class="link">open-source code</a>.
</p>

<style>
  .button-secondary {
    background-color: #babbbd;
    color: #182f4c;
  }
  .button-secondary:hover {
    background-color: #9a9b9d;
    color: #182f4c;
  }
</style>
