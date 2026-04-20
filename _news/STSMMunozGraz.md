---
layout: news
title: "Short Term Scientific Missiong by Juan Ricardo Muñoz"
date: 2026-04-20
short-description: "Juan Ricardo Muñoz works together with Hendrik Kleikamp on reduced-order modeling for parameter-dependent optimal control as part of an STSM in Graz."
authors:
  - kleikamp
image: "munozSTSM.jpg"
---

<h4>Abstract of the STSM:</h4>
<p>
The optimal control of parameter-dependent partial differential equations (PDEs) plays a central role in many scientific and engineering applications, including wave propagation, structural vibrations, and transport phenomena. Classical numerical approaches rely on high-fidelity discretizations such as finite element or finite difference methods. While these approaches accurately approximate the dynamics of the system, they lead to large-scale dynamical systems whose computational cost becomes prohibitive when repeated evaluations across the parameter space are required, as is typical in optimization and control contexts.
</p>
<p>
Reduced Order Models (ROMs) aim to address this challenge by constructing low-dimensional approximations that preserve the essential dynamics of the original system while significantly reducing computational complexity. However, classical projection-based ROM techniques often exhibit limited performance for transport-dominated phenomena, such as wave equations, due to the slow decay of the Kolmogorov $n$-widths of the associated solution manifold. In such cases, linear approximation spaces require large reduced dimensions to achieve accurate representations.
</p>
<p>
The proposed research activity focuses on the development of nonlinear reduced order modeling strategies based on machine learning, specifically using autoencoder neural networks. Autoencoders learn low-dimensional latent representations of high-dimensional solution data by encoding the solution manifold into a compact representation and reconstructing the original state from this latent space. This framework enables the approximation of PDE dynamics directly from data and provides a flexible alternative to classical projection-based methods.
</p>
<p>
In addition to the latent representation obtained through the autoencoder, the project investigates the implementation of a parameter-to-latent map in parameter-dependent optimal control problems as a separate machine learning surrogate that directly associates each parameter value with its corresponding latent representation. This strategy enables rapid online evaluation of parameter-dependent solutions by bypassing the high-dimensional solver entirely.
</p>
