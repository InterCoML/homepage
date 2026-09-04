---
layout: news
title: "Short Term Scientific Mission by Özkan Öztürk"
date: 2026-09-04
wg: 1
short-description: "Özkan Öztürk visits Dilara Kılınç in Budapest to work together on dynamical equations on time scales for autonomous robotic systems in the course of a Short-Term Scientific Mission."
authors:
  - ozturk
  - kilinc
image: "ozturkSTSM.jpeg"
---

<h4>Abstract of the STSM:</h4>
<p>
The convergence of control theory (CT) and machine learning (ML) has created transformative opportunities in
robotics and autonomous systems. However, a fundamental theoretical gap persists: most ML-based adaptive
controllers are formulated either in continuous time or on fixed discrete grids, whereas real-world autonomous
platforms-such as unicycle ground robots, unmanned aerial vehicles (UAVs), and networked multi-agent systems
operate under sampled-data mechanisms with non-uniform or event-triggered updates. This discrepancy between
continuous-time theoretical guarantees and inherently hybrid execution environments often lead to learning
behaviors that are difficult to analyze and rigorously certify.
</p>
<p>
Dynamical equations on time scales, introduced by Hilger (1988) and subsequently developed into a comprehensive
analytical framework, provide a unified calculus based on the delta derivative $f^\Delta$ defined on arbitrary
closed subsets $\mathbb{T}\subset\mathbb{R}$. This framework seamlessly generalizes differential
equations ($\mathbb{T}=\mathbb{R}$) and difference equations ($\mathbb{T}=\mathbb{Z}$),
making it a natural and powerful tool for analyzing adaptive and learning-based control systems that operate across
hybrid time domains.
</p>
<p>
The novelty of this STSM lies in the formulation of Model Reference Adaptive Control (MRAC) within the unified
framework of dynamical equations on time scales. While adaptive control has traditionally been studied either in
continuous-time or discrete-time analysis, the proposed approach provides a mathematically rigorous bridge
between these paradigms. This allows the analysis of adaptive learning mechanisms in robotic systems operating
under hybrid or non-uniform sampling conditions, which remains largely unexplored in the current literature. While
Lyapunov stability on time scales has been established for linear and bilinear systems (Zitane, 2022; DaCunha,
2005), the formulation of MRAC adaptation laws using the $\Delta$-derivative and the derivation of the associated
parameter convergence guarantees has not been addressed in the existing literature. Classical MRAC theory treats
continuous-time (Ioannou & Sun, 1996) and discrete-time (Li & Xie, 2007) cases separately; the proposed
framework unifies these under a single $\Delta$-calculus formulation, enabling stability certificates that remain valid
across variable sampling rates - a property critical for event-triggered robotic platforms. This directly addresses
InterCoML WG1's objective of developing rigorous theoretical foundations for learning-based control in cyber-
physical systems operating under non-uniform data acquisition.
</p>
