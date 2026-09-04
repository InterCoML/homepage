---
layout: news
title: "Short Term Scientific Missions by Yannick Lunk and Tim Roith"
date: 2026-08-31
wg: 1
short-description: "Yannick Lunk and Tim Roith are visiting the Machine Learning Genoa Center for their STSMs on hybrid first- and zeroth-order methods and basin hopping techniques for consensus-based optimization."
authors:
  - lunk
  - roith
  - molinari
image: "lunkRoithSTSMs1.jpg"
---

<h4>Yannick Lunk's STSM:</h4>
<h5>Hybrid First- and Zeroth-Order Methods for Inexact Forward–Backward Optimization</h5>
<p>
The primary goal of this STSM is to develop and analyze hybrid first- and
zeroth-order optimization methods for composite problems with a non-smooth or derivative-free
component. We consider a prototypical setting of minimizing a function of the form $f(x) + g(x)$, where the
component $f$ is smooth, so that its gradient is available and can be exploited by first-order methods, such
as Gradient Descent. Conversely, the component $g$ represents a non-smooth, non-convex regularization
or penalty term for which the proximal map is unavailable in closed form, or more generally a term that can
only be evaluated while derivative information is inaccessible or too expensive to compute. Such
composite optimization problems arise naturally in modern machine learning and control-oriented
applications - for instance, when optimizing data-driven models subject to black-box regularizers, or
embedded physical simulation constraints where only function responses are available. The objective of
the STSM is to study whether an inexact forward-backward scheme is convergent when the proximal step
for $g$ is not computed exactly, but instead approximated by a zeroth-order scheme.
</p>

<figure class="news-img-figure">
  <img class="news-img-large" src="{{ site.baseUrl }}/images/news/lunkRoithSTSMs2.jpg" />
</figure>
<h4>Tim Roith's STSM:</h4>
<h5>Basin hopping techniques for consensus-based optimization beyond Euclidean geometries</h5>
<p>
Particle-based algorithms are a promising framework for optimization problems where only function
evaluations, but no gradients, are needed. Consensus-based optimization (CBO) is a mathematically
well-founded instance, admitting global convergence guarantees in non-convex settings, which is not
possible for first-order methods like gradient descent. Gradient-based methods exploit local information:
they may converge to sub-optimal local minima yet typically outperform particle-based methods in high-dimensional
tasks, which are common for machine learning applications. The first goal of this mission is
to derive a hybrid scheme combining a local solver with CBO as the global component. This has recently
been studied at the host institution with a different particle approximation. Our aim is to apply this
technique to CBO, compare the numerical performance and investigate first steps towards a
convergence proof. Furthermore, we want to go beyond the Euclidean setting and employ MirrorCBO,
which allows changing the underlying dynamics through a task-specific mirror map. The goal is to train
sparse neural networks, as previously done with pure MirrorCBO, but now augmented with local
gradients to potentially outperform mirror descent on this task. A further aim of this STSM is to establish
a new collaboration between the MaLGa, the University of Würzburg and TUM.
</p>
