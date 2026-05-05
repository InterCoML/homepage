---
layout: news
title: "Short Term Scientific Mission by Juan Ricardo Muñoz"
date: 2026-04-20
wg: 2
short-description: "Juan Ricardo Muñoz works together with Hendrik Kleikamp on reduced-order modeling for parameter-dependent optimal control as part of an STSM in Graz."
authors:
  - kleikamp
image: "munozSTSM.jpg"
---

<h4>Abstract of the STSM:</h4>
<p>
The <b>optimal control</b> of <b>parameter-dependent partial differential equations</b> plays a central role in many scientific and engineering applications, including wave propagation, structural vibrations, and transport phenomena. Classical numerical approaches rely on high-fidelity discretizations such as finite element or finite difference methods. While these approaches accurately approximate the dynamics of the system, they lead to <b>large-scale dynamical systems</b> whose computational cost becomes prohibitive when repeated evaluations across the parameter space are required, as is typical in optimization and control contexts.
</p>
<p>
<b>Reduced order models</b> aim to address this challenge by constructing <b>low-dimensional approximations</b> that preserve the essential dynamics of the original system while significantly reducing computational complexity. However, classical <b>projection-based reduced order modeling techniques</b> often exhibit limited performance for transport-dominated phenomena, such as wave equations, due to the slow decay of the Kolmogorov $n$-widths of the associated solution manifold. In such cases, linear approximation spaces require large reduced dimensions to achieve accurate representations.
</p>
<p>
The proposed research activity focuses on the development of <b>nonlinear reduced order modeling strategies</b> based on <b>machine learning</b>, specifically using autoencoder neural networks. Autoencoders learn <b>low-dimensional latent representations</b> of high-dimensional solution data by encoding the solution manifold into a compact representation and reconstructing the original state from this latent space. This framework enables the approximation of dynamics directly from data and provides a flexible alternative to classical projection-based methods.
</p>
<p>
In addition to the latent representation obtained through the autoencoder, the project investigates the implementation of a <b>parameter-to-latent map</b> in parameter-dependent optimal control problems as a separate machine learning surrogate that directly associates each parameter value with its corresponding latent representation. This strategy enables <b>rapid online evaluation</b> of parameter-dependent solutions by bypassing the high-dimensional solver entirely.
</p>
