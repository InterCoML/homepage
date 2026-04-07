/**
 * Interactive cloth simulation with Koopman-LQR control visualization.
 * Uses a mass-spring model with Verlet integration on an 8x8 grid.
 */
document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("cloth-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  // Grid parameters
  var NX = 8, NY = 8;
  var restLen = 0.12; // rest length between adjacent nodes
  var gravity = -0.25;
  var damping = 0.98;
  var dt = 0.016;
  var stiffness = 2000;
  var shearStiffness = 1000;

  // 3D projection parameters
  var camDist = 3.0;
  var rotX = 0.4, rotY = -0.5;
  var scale = 280;

  // State
  var nodes = [];
  var springs = [];
  var targetNodes = null;
  var controlling = false;
  var controlProgress = 0;
  var controlSpeed = 0.005;
  var showTarget = true;
  var animId = null;

  // Upper corner indices (pinned/actuated)
  var pinnedLeft = (NY - 1) * NX; // top-left
  var pinnedRight = NY * NX - 1;  // top-right

  function initCloth() {
    nodes = [];
    springs = [];

    // Create nodes in a curved initial shape
    for (var j = 0; j < NY; j++) {
      for (var i = 0; i < NX; i++) {
        var u = (i / (NX - 1) - 0.5);
        var v = (j / (NY - 1) - 0.5);
        var x = u;
        var y = 0.75 * Math.sqrt(Math.max(0, 1 - 4 * u * u)) * (1 - v * 0.3) + 0.1;
        var z = v;
        nodes.push({
          x: x, y: y, z: z,
          px: x, py: y, pz: z, // previous position for Verlet
          pinned: false,
        });
      }
    }

    // Pin upper corners
    nodes[pinnedLeft].pinned = true;
    nodes[pinnedRight].pinned = true;

    // Structural springs (horizontal + vertical)
    for (var j = 0; j < NY; j++) {
      for (var i = 0; i < NX; i++) {
        var idx = j * NX + i;
        if (i < NX - 1) addSpring(idx, idx + 1, stiffness);
        if (j < NY - 1) addSpring(idx, idx + NX, stiffness);
        // Shear springs
        if (i < NX - 1 && j < NY - 1) {
          addSpring(idx, idx + NX + 1, shearStiffness);
          addSpring(idx + 1, idx + NX, shearStiffness);
        }
        // Bend springs (skip one)
        if (i < NX - 2) addSpring(idx, idx + 2, stiffness * 0.3);
        if (j < NY - 2) addSpring(idx, idx + 2 * NX, stiffness * 0.3);
      }
    }
  }

  function addSpring(a, b, k) {
    var dx = nodes[b].x - nodes[a].x;
    var dy = nodes[b].y - nodes[a].y;
    var dz = nodes[b].z - nodes[a].z;
    var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    springs.push({ a: a, b: b, restLen: len, k: k });
  }

  function computeTargetPose() {
    // Target: rotate the initial cloth by 45 degrees around the line between upper corners
    targetNodes = [];
    for (var j = 0; j < NY; j++) {
      for (var i = 0; i < NX; i++) {
        var u = (i / (NX - 1) - 0.5);
        var v = (j / (NY - 1) - 0.5);
        var x = u;
        var baseY = 0.75 * Math.sqrt(Math.max(0, 1 - 4 * u * u)) * (1 - v * 0.3) + 0.1;
        var z = v;

        // Rotate around x-axis by 45 degrees (swing the cloth)
        var angle = Math.PI / 4;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        var ny = baseY * cos - z * sin;
        var nz = baseY * sin + z * cos;

        targetNodes.push({ x: x, y: ny, z: nz });
      }
    }
  }

  function step() {
    // Verlet integration with gravity
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.pinned) continue;
      var vx = (n.x - n.px) * damping;
      var vy = (n.y - n.py) * damping;
      var vz = (n.z - n.pz) * damping;
      n.px = n.x;
      n.py = n.y;
      n.pz = n.z;
      n.x += vx;
      n.y += vy + gravity * dt * dt;
      n.z += vz;
    }

    // Spring constraints (multiple iterations for stability)
    for (var iter = 0; iter < 8; iter++) {
      for (var s = 0; s < springs.length; s++) {
        var sp = springs[s];
        var a = nodes[sp.a], b = nodes[sp.b];
        var dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1e-8) continue;
        var diff = (dist - sp.restLen) / dist * 0.5;
        var factor = Math.min(diff, 0.1); // limit correction for stability
        if (!a.pinned) { a.x += dx * factor; a.y += dy * factor; a.z += dz * factor; }
        if (!b.pinned) { b.x -= dx * factor; b.y -= dy * factor; b.z -= dz * factor; }
      }
    }
  }

  function applyControl() {
    if (!controlling || !targetNodes) return;

    controlProgress = Math.min(controlProgress + controlSpeed, 1);
    var t = controlProgress;
    // Smooth easing
    t = t * t * (3 - 2 * t);

    // Move pinned corners toward target
    var lTarget = targetNodes[pinnedLeft];
    var rTarget = targetNodes[pinnedRight];

    // Store initial positions of corners at control start
    if (!nodes[pinnedLeft].startX) {
      nodes[pinnedLeft].startX = nodes[pinnedLeft].x;
      nodes[pinnedLeft].startY = nodes[pinnedLeft].y;
      nodes[pinnedLeft].startZ = nodes[pinnedLeft].z;
      nodes[pinnedRight].startX = nodes[pinnedRight].x;
      nodes[pinnedRight].startY = nodes[pinnedRight].y;
      nodes[pinnedRight].startZ = nodes[pinnedRight].z;
    }

    var nl = nodes[pinnedLeft], nr = nodes[pinnedRight];
    nl.x = nl.startX + (lTarget.x - nl.startX) * t;
    nl.y = nl.startY + (lTarget.y - nl.startY) * t;
    nl.z = nl.startZ + (lTarget.z - nl.startZ) * t;
    nr.x = nr.startX + (rTarget.x - nr.startX) * t;
    nr.y = nr.startY + (rTarget.y - nr.startY) * t;
    nr.z = nr.startZ + (rTarget.z - nr.startZ) * t;

    // Gentle guidance force on all nodes toward target (simulates LQR feedback effect)
    var guidanceStrength = 0.002 * t;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].pinned) continue;
      var tgt = targetNodes[i];
      nodes[i].x += (tgt.x - nodes[i].x) * guidanceStrength;
      nodes[i].y += (tgt.y - nodes[i].y) * guidanceStrength;
      nodes[i].z += (tgt.z - nodes[i].z) * guidanceStrength;
    }

    // Update RMSE display
    updateRMSE();
  }

  function updateRMSE() {
    var rmse = 0;
    for (var i = 0; i < nodes.length; i++) {
      var dx = nodes[i].x - targetNodes[i].x;
      var dy = nodes[i].y - targetNodes[i].y;
      var dz = nodes[i].z - targetNodes[i].z;
      rmse += dx * dx + dy * dy + dz * dz;
    }
    rmse = Math.sqrt(rmse / nodes.length);
    var el = document.getElementById("cloth-rmse");
    if (el) el.textContent = rmse.toFixed(4);
  }

  // 3D projection
  function project(x, y, z) {
    // Rotate around Y
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    var x1 = x * cosY + z * sinY;
    var z1 = -x * sinY + z * cosY;
    // Rotate around X
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    var y1 = y * cosX - z1 * sinX;
    var z2 = y * sinX + z1 * cosX;
    // Perspective
    var w = camDist / (camDist + z2);
    return {
      sx: canvas.width / 2 + x1 * scale * w,
      sy: canvas.height / 2 - y1 * scale * w,
      depth: z2,
    };
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw target as transparent mesh
    if (showTarget && targetNodes) {
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#c0392b";
      for (var j = 0; j < NY; j++) {
        for (var i = 0; i < NX; i++) {
          var idx = j * NX + i;
          var p = project(targetNodes[idx].x, targetNodes[idx].y, targetNodes[idx].z);
          if (i < NX - 1) {
            var p2 = project(targetNodes[idx + 1].x, targetNodes[idx + 1].y, targetNodes[idx + 1].z);
            ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
          }
          if (j < NY - 1) {
            var p2 = project(targetNodes[idx + NX].x, targetNodes[idx + NX].y, targetNodes[idx + NX].z);
            ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;
    }

    // Draw cloth mesh with depth-based shading
    for (var j = 0; j < NY - 1; j++) {
      for (var i = 0; i < NX - 1; i++) {
        var i00 = j * NX + i;
        var i10 = i00 + 1;
        var i01 = i00 + NX;
        var i11 = i00 + NX + 1;

        var p00 = project(nodes[i00].x, nodes[i00].y, nodes[i00].z);
        var p10 = project(nodes[i10].x, nodes[i10].y, nodes[i10].z);
        var p01 = project(nodes[i01].x, nodes[i01].y, nodes[i01].z);
        var p11 = project(nodes[i11].x, nodes[i11].y, nodes[i11].z);

        // Simple face normal for shading
        var ax = nodes[i10].x - nodes[i00].x, ay = nodes[i10].y - nodes[i00].y, az = nodes[i10].z - nodes[i00].z;
        var bx = nodes[i01].x - nodes[i00].x, by = nodes[i01].y - nodes[i00].y, bz = nodes[i01].z - nodes[i00].z;
        var nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
        var nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (nLen > 0) { nx /= nLen; ny /= nLen; nz /= nLen; }
        var light = Math.abs(nx * 0.2 + ny * 0.8 + nz * 0.3);
        var shade = Math.floor(140 + light * 115);

        ctx.fillStyle = "rgb(" + Math.floor(shade * 0.22) + "," + Math.floor(shade * 0.63) + "," + Math.floor(shade * 0.5) + ")";
        ctx.beginPath();
        ctx.moveTo(p00.sx, p00.sy);
        ctx.lineTo(p10.sx, p10.sy);
        ctx.lineTo(p11.sx, p11.sy);
        ctx.lineTo(p01.sx, p01.sy);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw wireframe
    ctx.strokeStyle = "rgba(24, 47, 76, 0.3)";
    ctx.lineWidth = 0.5;
    for (var j = 0; j < NY; j++) {
      for (var i = 0; i < NX; i++) {
        var idx = j * NX + i;
        var p = project(nodes[idx].x, nodes[idx].y, nodes[idx].z);
        if (i < NX - 1) {
          var p2 = project(nodes[idx + 1].x, nodes[idx + 1].y, nodes[idx + 1].z);
          ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
        }
        if (j < NY - 1) {
          var p2 = project(nodes[idx + NX].x, nodes[idx + NX].y, nodes[idx + NX].z);
          ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();
        }
      }
    }

    // Highlight pinned corners
    var pL = project(nodes[pinnedLeft].x, nodes[pinnedLeft].y, nodes[pinnedLeft].z);
    var pR = project(nodes[pinnedRight].x, nodes[pinnedRight].y, nodes[pinnedRight].z);
    ctx.fillStyle = "#c0392b";
    ctx.beginPath(); ctx.arc(pL.sx, pL.sy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(pR.sx, pR.sy, 6, 0, Math.PI * 2); ctx.fill();

    // Label
    ctx.fillStyle = "#182f4c";
    ctx.font = "12px sans-serif";
    ctx.fillText("Left corner", pL.sx - 30, pL.sy - 12);
    ctx.fillText("Right corner", pR.sx - 30, pR.sy - 12);
  }

  function animate() {
    applyControl();
    step();
    render();
    animId = requestAnimationFrame(animate);
  }

  // Controls
  var btnControl = document.getElementById("btn-cloth-control");
  var btnReset = document.getElementById("btn-cloth-reset");
  var chkTarget = document.getElementById("chk-show-target");

  if (btnControl) {
    btnControl.addEventListener("click", function () {
      if (!controlling) {
        controlling = true;
        controlProgress = 0;
        delete nodes[pinnedLeft].startX;
        delete nodes[pinnedRight].startX;
        btnControl.textContent = "Controlling...";
        btnControl.disabled = true;
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", function () {
      controlling = false;
      controlProgress = 0;
      initCloth();
      if (btnControl) {
        btnControl.textContent = "Apply Koopman-LQR Control";
        btnControl.disabled = false;
      }
      var el = document.getElementById("cloth-rmse");
      if (el) el.textContent = "-";
    });
  }

  if (chkTarget) {
    chkTarget.addEventListener("change", function () {
      showTarget = this.checked;
    });
  }

  // Mouse rotation
  var dragging = false, lastMX = 0, lastMY = 0;
  canvas.addEventListener("mousedown", function (e) {
    dragging = true; lastMX = e.clientX; lastMY = e.clientY;
  });
  window.addEventListener("mouseup", function () { dragging = false; });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    rotY += (e.clientX - lastMX) * 0.01;
    rotX += (e.clientY - lastMY) * 0.01;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    lastMX = e.clientX; lastMY = e.clientY;
  });

  // Touch rotation
  canvas.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) {
      dragging = true;
      lastMX = e.touches[0].clientX;
      lastMY = e.touches[0].clientY;
      e.preventDefault();
    }
  });
  canvas.addEventListener("touchmove", function (e) {
    if (!dragging || e.touches.length !== 1) return;
    rotY += (e.touches[0].clientX - lastMX) * 0.01;
    rotX += (e.touches[0].clientY - lastMY) * 0.01;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    lastMX = e.touches[0].clientX;
    lastMY = e.touches[0].clientY;
    e.preventDefault();
  });
  canvas.addEventListener("touchend", function () { dragging = false; });

  // Initialize and start
  initCloth();
  computeTargetPose();
  animate();
});
