---
layout: dissemination
title: "From reduced-order modeling to nonlinear surrogates for parameter-dependent optimal control"
date: 2026-09-10
wg: 2
short-description: "A summary of the STSM by Juan Ricardo Muñoz at the University of Graz."
image: "architecture-u-net.png"
authors:
  - munoz
  - kleikamp
  - lazar
---

<p>
Parameter-dependent optimal control problems arise when the dynamics,
target states, physical coefficients, or other components of a controlled
system vary with a set of parameters. They are particularly important in
applications where an optimal control problem must be solved repeatedly
for many different configurations. Although high-fidelity numerical
methods can provide accurate solutions, repeatedly solving the underlying
partial differential equations and optimality systems can quickly become
computationally prohibitive. This makes the construction of efficient
surrogate models a central question for many-query optimal control
problems.
</p>
<p>
A natural strategy is to use reduced-order models, replacing the original
high-dimensional problem by an approximation in a much smaller space.
An example for such a method is discussed in
<a href="{{ site.baseUrl }}/dissemination/adaptive-model-hierarchy.html" target="_blank" class="link">this blogpost</a>.
However, this approach faces a limitation when the family
of solutions cannot be represented accurately by low-dimensional linear
spaces. This phenomenon can be quantified through the
<i>Kolmogorov $N$-width</i>, which measures how well a solution manifold
can be approximated by an $N$-dimensional linear space. When the
Kolmogorov width decays slowly, increasing the dimension of a classical
reduced basis leads only to a gradual improvement in accuracy and can
considerably reduce the computational advantages of model reduction.
</p>
<p>
This difficulty was the motivation for the <b>Short-Term Scientific Mission (STSM)</b>
within <b>COST Action CA24136 InterCoML</b>, giving as result the work
<em><a href="https://arxiv.org/abs/2607.13226" target="_blank" class="link">
"Overcoming slow Kolmogorov width decay in parametric optimal
control via neural network surrogates"
</a></em>, by Hendrik Kleikamp, Martin Lazar, and Juan Ricardo Muñoz,
that is nowadays under revision.
</p>
<p>
The work considers parameter-dependent linear-quadratic optimal control
problems for which the optimal solution can be characterized through the
<i>final-time adjoint state</i>. This observation provides a particularly
useful perspective: rather than approximating the entire state and control
trajectories directly, the problem can be reduced to approximating the
parameter-dependent final-time adjoint, from which the optimal state and
control can subsequently be recovered.
</p>
<p>
The theoretical analysis identifies structural obstructions
to classical linear reduced-order modeling. For distributed control of
the heat equation, we show that a slowly decaying Kolmogorov width of the
parameter-dependent target manifold can be inherited by the manifold of
final-time adjoints.
</p>
<p>
In particular, moving and discontinuous targets generate a
transport-dominated structure that remains difficult to approximate with
low-dimensional linear spaces, despite the regularizing properties of the
heat equation. Thus, the difficulty is not simply caused by the numerical
discretization or by the dynamics: it is an intrinsic feature of the
parameter dependence itself.
</p>

<h2>Moving towards nonlinear machine-learning surrogates</h2>
<p>
Motivated by this analysis, we investigate nonlinear machine-learning
surrogates as an alternative. A U-Net architecture is used to learn the
map from parameter-dependent spatial fields (target states and
diffusivity fields) to the corresponding optimal final-time adjoint.
The architecture is shown in Figure 1.
</p>
<div id="fig-unet-architecture" class="article-figure">
  <img src="{{ site.baseUrl }}/images/dissemination/architecture-u-net.png" alt="Diagram of the U-Net encoder–decoder architecture mapping parametric input fields to the optimal final-time adjoint">
  <p><em>Figure 1: U-Net architecture with parametric fields as inputs and optimal final time adjoints as output.</em></p>
</div>
<p>
This formulation allows the network to retain information
about the position and geometry of localized structures instead of
requiring this information to be reconstructed from a low-dimensional
parameter vector. Moreover, since the network predicts the
final-time adjoint itself, a residual-based <i>a posteriori</i> error
estimator remains available to assess the quality of the approximation.
</p>
<p>
The numerical experiments support this approach. Across two
two-dimensional optimal control problems, including a more challenging
example combining a moving target, a discontinuous parameter-dependent
diffusivity, and a localized control region, the U-Net consistently
provides the most accurate approximation among the considered linear and
nonlinear methods.
</p>
<p>
Particularly relevant for practical applications is its performance in
the small-data regime. In the reported experiments, a U-Net trained with
only 100 snapshots already achieves average final-time-adjoint errors
more than one order of magnitude smaller than competing approaches
trained with 1000 snapshots. Once trained, prediction of the final-time
adjoint requires less than one millisecond, while recovery of the state
and control still provides substantial computational speedups over the
full-order problem.
Quantitative results of the U-Net are shown in Figure 2.
</p>
<div id="fig-unet-results" class="article-figure">
  <img src="{{ site.baseUrl }}/images/dissemination/results-u-net.png" alt="U-Net surrogate results for three test parameters: diffusivity, target, full-order and predicted final-time adjoints, and pointwise error">
  <p><em>Figure 2: Results of the U-Net surrogate for three test parameters. Columns from left to right: diffusivity, target state, full-order model final time adjoint, U-Net prediction, and pointwise error. The orange square depicts the control domain.</em></p>
</div>

<figure class="news-img-figure">
  <img class="news-img-large" src="{{ site.baseUrl }}/images/dissemination/visit-munoz.jpeg" />
</figure>
<h2>From an STSM to a research collaboration</h2>
<p>
An important part of the development of this research was supported by a
<b>Short-Term Scientific Mission (STSM)</b> within
<b>COST Action CA24136 InterCoML -- Control and Machine Learning</b>.
The STSM brought Juan Ricardo Muñoz to the University of Graz to work
with Hendrik Kleikamp on nonlinear model-reduction strategies for
parameter-dependent optimal control.
</p>
<p>
The original research plan focused particularly on autoencoders and
parameter-to-latent mappings as alternatives to classical linear
reduced-order models in situations characterized by slowly decaying
Kolmogorov widths. The  collaboration made possible by the STSM
helped accelerate the research beyond its initial formulation. Working
in the same place allowed numerical experiments to be developed and
discussed rapidly, limitations of the initial approaches to be identified,
and new ideas to be tested directly.
</p>
<p>
In particular, the investigation of autoencoder and parameter-to-latent
strategies contributed to a broader comparison of nonlinear
representations and ultimately to the field-based U-Net approach
developed in the paper. The resulting work therefore illustrates one of
the main benefits of STSMs: they provide researchers with dedicated time
and a shared environment in which preliminary ideas can be transformed
into concrete research directions and collaborative results.
</p>
<p>
Additionally,  the environment of the
<b><a href="https://idea-lab.uni-graz.at" target="_blank" class="link">IDea_Lab at the University of Graz</a></b>,
where Hendrik Kleikamp is based, provided a valuable setting for
exchanging ideas at the interface of mathematical modeling, numerical
analysis, reduced-order modeling, and machine learning.
</p>
<p>
The STSM thus contributed not only to accelerating a specific research
project, but also to strengthening connections between researchers and
institutions within the InterCoML network. Such opportunities illustrate
the broader role of COST Actions in creating research networks in which
short scientific visits can initiate new discussions, accelerate ongoing
projects, and create connections that extend beyond the duration of the
visit itself.
</p>
