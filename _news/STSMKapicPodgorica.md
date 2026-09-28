---
layout: news
title: "Short Term Scientific Mission by Zinaid Kapić"
date: 2026-09-20
wg: 1
short-description: "Zinaid Kapić visits Vladimir Jaćimović in Podgorica at the University of Montenegro as a Short-Term Scientific Mission to explore stochastic policies in directional control and reinforcement learning."
authors:
  - kapic
  - jacimovic
image: "kapicSTSM.jpg"
---

<p>
Reinforcement learning policies are usually stochastic: instead of always picking the same action, the agent samples from a distribution, which allows exploration and avoids predictable behavior. When actions are directions rather than points, this distribution should be defined on a circle or sphere rather than on the real line, which is the subject of directional statistics.
</p>
<p>
This was the focus of a Short-Term Scientific Mission (STSM) within COST Action CA24136 InterCoML, titled "<b>Stochastic Policies in Directional Control and Reinforcement Learning</b>". The STSM brought <b>Zinaid Kapić</b>, PhD student from Bosnia and Herzegovina, to the University of Montenegro to work with <b>Prof. Vladimir Jaćimović</b>, his doctoral co-mentor.
</p>

<h4>Why hyperbolic space</h4>
<p>
One setting where this becomes particularly relevant is reasoning, which can be conceptualized as navigating a tree of possibilities, with multi-agent reasoning corresponding to several agents navigating several such trees simultaneously. Trees and other hierarchical structures do not embed well into Euclidean space, but are known to embed much more faithfully into hyperbolic space. Intuitively, the volume of hyperbolic space grows exponentially with distance from the center, just like a tree's node count grows with depth, as illustrated in the figure below. This has motivated recent work arguing in favor of hyperbolic deep reinforcement learning.
</p>
<div id="fig-poincare-disc-embedding" class="article-figure">
  <img src="{{ site.baseUrl }}/images/news/poincareDiscEmbedding.png" alt="Poincaré disc embedding of the state space in Game of 24">
  <p><em>Figure 1. Poincaré disc embedding of the state space in Game of 24, one of the reasoning tasks used to illustrate the framework.</em></p>
</div>

<p>
Building on this observation, Kapić and Jaćimović developed an information-geometric framework for computing natural policy gradients on hyperbolic discs. The task is formalized as a multi-agent Markov decision process with hyperbolic state space, given as a product of Poincaré discs, circular action spaces, and stochastic policy encoded by the wrapped Cauchy family of distributions. They showed that, in this setting, natural policy gradients can be written explicitly and computed efficiently using complex-analytic and conformal-geometric techniques. Interestingly, the Fisher information matrix of the wrapped Cauchy family itself carries a hyperbolic structure, meaning the decision model, and not just the state space, is naturally hyperbolic. This gives further weight to the case for hyperbolic reinforcement learning. A trainable Kuramoto model, a system of coupled oscillators, was set up as a computational tool for the policy gradient update, with couplings and frequencies adjusted to implement the update directly. Benchmark tasks with hierarchical structure were also selected, and an initial implementation was set up and partially tested during the visit.
</p>

<h4>Outcomes and next steps</h4>
<p>
The visit gave Kapić and Jaćimović a focused week to work through the framework and agree on a plan for the remaining work. The collaboration continues remotely, with the aim of completing the implementation, running experiments on the selected benchmarks, and preparing a scientific paper and open-source release acknowledging COST Action CA24136.
</p>
