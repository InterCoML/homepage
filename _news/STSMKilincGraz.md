---
layout: news
title: "Short Term Scientific Mission by Dilara Kılınç"
date: 2026-06-29
wg: 2
short-description: "Dilara Kılınç works together with Hendrik Kleikamp on driver intention prediction for autonomous driving as part of an STSM in Graz."
authors:
  - kleikamp
image: "kilincSTSM.jpeg"
---

<h4>Abstract of the STSM:</h4>
<p>
In recent years, the field of <b>autonomous driving</b> has seen tremendous developments on the technical side. At the same time, extensive discussions about safety of autonomous vehicles arose that have continued until today. The control of autonomous vehicles clearly constitutes an important safety critical task that has to be secure for both the occupants of the car itself and other traffic participants. It is therefore indispensable to provide security guarantees for the behavior of the autonomous vehicle.
</p>
<p>
In this project, we aim to continue the work previously performed by Dilara on <b>driver behavior classification</b>. We plan to pursue two different directions during the STSM: On the one hand side, <b>conformal prediction</b> will be used as a tool to obtain confidence intervals for the behavior classification that allow to adapt the action chosen by the autonomous vehicle depending on the confidence of the classification. On the other hand, a <b>control-theoretic point of view</b> will be taken to further improve the performance of the classification algorithms.
</p>
<p>
The previous work of Dilara focused on the challenges autonomous vehicles face during highway lane changes due to complex and unpredictable traffic conditions. The work employed <b>Gaussian Mixture Models (GMMs)</b> and a <b>Recursive Bayesian Filter</b> to infer driver intentions at the maneuver level, establishing a foundation for more detailed modeling of driver behavior. This approach also provides a structured basis for advanced data-driven methodologies. Utilizing the highD dataset of highway trajectories, GMMs model the statistical distributions of continuous features to generate likelihoods, while the Recursive Bayesian Filter models the temporal evolution of maneuvers and updates the system's belief state as new data are received. At the end of the work, the evaluation revealed a key limitation: the predominance of lane-keeping led to model overconfidence and a bias against predicting lane changes. On this point, <b>calibration</b> can address this issue by reducing overconfidence in the majority class and ensuring that rare maneuvers are not neglected. When the posterior probability of a rare maneuver increases, Conformal Prediction expands the prediction set, thereby avoiding overconfident, single predictions. This method guarantees that the true intent is included in the prediction set at a specified confidence level. The next phase of this work will investigate integrating the intent inference model with control strategies.
</p>
