---
layout: dissemination
title: "Robust lane-change intention anticipation under uncertainty based on a recursive Bayesian filtering approach"
date: 2026-11-10
wg: 2
short-description: "A summary of the framework for robust lane-change anticipation developed during an STSM by Dilara Kılınç while visiting Hendrik Kleikamp at the University of Graz."
image: "recursive-bayesian-filtering.png"
card-image-only: true
authors:
  - kilinc
  - kleikamp
  - viti
---

<span class="author-note">This blog post was written by Dilara Kılınç.</span>
<p>
Safety in autonomous driving depends not only on accurately perceiving the
surrounding environment but also on anticipating other road users' actions
in time. Highway lane changes are particularly important because they
involve interactions among multiple vehicles and can rapidly alter
trajectories. Yet accurate anticipation alone is insufficient. In
real-world driving, sensor observations may be incomplete, predictions may
fluctuate over time, and models’ confidence levels may not reflect their
actual predictive reliability. Our research therefore addresses not only
prediction accuracy but also robustness to missing observations, temporal
consistency, and the computational efficiency required for real-time
applications. We examine these challenges by considering three possible
driving intentions: maintaining the current lane, changing to the left
lane, and changing to the right lane. For prediction horizons of one to
six seconds, our approach estimates the probability of each intention and
updates these estimates continuously as new observations become available.
</p>

<h2>Recursive Bayesian Filtering for Intention Anticipation</h2>
<p>
We formulate lane-change intention anticipation as a sequential
probabilistic inference problem. At each time step $t$, the driver's
intention is represented by a discrete latent variable $I_t\in\{\mathrm{K},\mathrm{L},\mathrm{R}\}$,
corresponding to lane keeping, left lane change, and right lane change,
respectively. Given the observation history $O_{t-w:t}$, where $w$ denotes
the observation window, our objective is to estimate the posterior
probability of each possible intention. To capture the temporal evolution
of driving intentions, we employ a recursive Bayesian filter, which can
also be interpreted as a Hidden Markov Model (HMM). Under first-order
Markov and conditional observation independence assumptions, the
posterior distribution is updated according to
$$
P[I_t\mid O_{t-w},\ldots,O_t] = \frac{1}{Z_t}P[O_t\mid I_t]\cdot\sum\limits_{I_{t-1}\in\{\mathrm{K},\mathrm{L},\mathrm{R}\}}P[I_t\mid I_{t-1}]\cdot P[I_{t-1}\mid O_{t-w},\ldots,O_{t-1}].
$$
Here, $P[O_t\mid I_t]$ represents the observation likelihood, $P[I_t\mid I_{t-1}]$
denotes the transition probabilities between driving intentions, and $Z_t=P[O_t\mid O_{t-w},\ldots,O_{t-1}]$
is a normalization constant. By recursively incorporating new observations
and previous posterior estimates, the filter maintains an evolving probability
distribution over the possible driving intentions. 
</p>
<div id="fig-recursive-bayesian-filtering" class="article-figure">
  <img src="{{ site.baseUrl }}/images/dissemination/recursive-bayesian-filtering.png" alt="Sketch of the recursive Bayesian filtering method">
  <p><em>Figure 1: Sketch of the posterior evolution in the recursive Bayesian filtering approach for a left-change example.</em></p>
</div>
<p>
Figure 1 illustrates the recursive evolution of the posterior distribution
over driving intentions. In this example, the posterior concentrates
on the intention class $L$, indicating a change to the left lane.
Starting from a uniform prior distribution at time $t-w$, the model accumulates
evidence for class $L$ over a window of length $w$, taking the incoming
observations as well as the previous posterior distribution into account.
</p>
<p>
A key component of this framework is estimating the observation likelihood.
We investigate two complementary approaches. The first employs Gaussian
Mixture Models (GMMs) to represent the class-conditional distribution of
observations. An important advantage of this generative formulation is its
ability to handle missing observations through analytical marginalization,
without requiring artificial replacement values. The second approach
employs a Gradient Boosting Machine (GBM) as a discriminative classifier.
To incorporate its predicted posterior probabilities into the Bayesian
filtering framework, we apply a scaled-likelihood transformation.
This transformation enables the GBM to provide observation likelihoods
for recursive inference while leveraging its ability to handle
higher-dimensional feature representations.
</p>

<h2>Handling Incomplete Observations</h2>
<p>
We evaluate the proposed framework using the highD dataset, which contains
naturalistic vehicle trajectories recorded by drones on German highways at
a sampling frequency of 25 Hz. Our compact observation representation
comprises 16 features, combining the target vehicle's longitudinal and
lateral velocities and accelerations with the relative distances and
velocities of six surrounding vehicles.
</p>
<p>
To assess robustness to imperfect sensing, we simulate two observation
dropout mechanisms: independent random dropout and temporally correlated
bursty dropout. While the GMM handles incomplete observations through
marginalization, we evaluate the GBM-based approach using different
imputation strategies, including Last Observation Carried Forward (LOCF).
The evaluation considers predictive accuracy, robustness to missing observations,
temporal consistency, probability calibration, and computational efficiency.
</p>

<h2>Probability Calibration</h2>
<p>
A model may correctly classify driving intentions while assigning confidence
levels that consistently overestimate or underestimate the observed frequency
of those events. For instance, if a model predicts an 80% probability of a
lane change across many comparable situations, about 80% of those situations
should result in a lane change for the predictions to be well calibrated.
We therefore investigate probability calibration for reliable intention anticipation.
</p>
<p>
The calibration analysis considers both class-wise probabilities and the
combined probability of a lane change. We evaluate three post-hoc calibration
methods applied to the probability estimates produced by the recursive Bayesian filter:
<ul>
  <li>Isotonic regression, a nonparametric monotonic method that maps predicted probabilities to calibrated estimates based on observed event frequencies.</li>
  <li>Beta calibration, a parametric transformation that corrects systematic overconfidence or underconfidence.</li>
  <li>Venn–ABERS predictors provide probability intervals and can also convey uncertainty in the estimated probabilities.</li>
</ul>
To quantify calibration reliability, we use the Expected Calibration Error (ECE).
</p>
<p>
A key advantage of post-hoc calibration is that it can improve the reliability
of probability estimates without retraining the underlying prediction model.
This is essential for autonomous driving, where these estimates can inform
downstream motion planning and risk assessment.
</p>

<h2>Results and Discussion</h2>
<h3>Robustness to Missing Observations</h3>
<p>
The experiments demonstrate that the GBM-based Bayesian filter maintains high
predictive performance even under substantial observation loss. For a four-second
prediction horizon, the GBM–LOCF approach achieves 94.5% balanced accuracy with
complete observations and retains 94.1% when 80% of neighbouring-vehicle
observations are unavailable. These findings highlight the importance of
appropriate missing-data strategies in maintaining robust intention estimates
under incomplete sensing conditions.
</p>
<h3>Temporal Consistency</h3>
<p>
Beyond classification accuracy, we investigate whether the predicted intentions
remain consistent over time. Compared with a stacked-GBM baseline, the recursive
Bayesian filter reduces the prediction-label flip rate by about one-third while
maintaining comparable predictive accuracy. The filtering approach also improves
sustained anticipation by reducing unnecessary fluctuations in predicted intentions
before the actual lane crossing. This suggests that recursive filtering can provide
more temporally stable estimates while preserving the ability to anticipate
upcoming maneuvers.
</p>
<h3>Probability Calibration</h3>
<p>
For the GBM-based model, isotonic regression reduces the lane-change Expected
Calibration Error (ECE) from 0.056 to 0.022, and balanced accuracy increases
from 94.4% to 95.0% in the calibration evaluation. These findings demonstrate
that probability calibration can improve the reliability of intention estimates
without compromising predictive performance.
</p>
<h3>Computational Efficiency</h3>
<p>
Our experimental implementation of the GBM-based recursive filter achieves an
average inference time of approximately 0.017 milliseconds per frame, which is
well-suited for real time applications.
</p>
<h3>Conclusions and Future Perspectives</h3>
<p>
Our findings show that robustness to incomplete observations, temporal consistency,
and well-calibrated probability estimates are important for supporting
safety-critical decisions in autonomous driving. The proposed recursive
Bayesian framework offers an interpretable and computationally efficient
approach to these challenges. Further evaluation across diverse traffic
conditions and integration into real-world autonomous driving platforms
remain important directions for future research.
</p>

<figure class="news-img-figure">
  <img class="news-img-large" src="{{ site.baseUrl }}/images/dissemination/visit-kilinc.jpeg" />
</figure>
<h2>From an STSM to a research collaboration</h2>
<p>
This research was conducted as part of the <b>Short-Term Scientific Mission (STSM)</b>
at the University of Graz, supported by COST Action CA24136 InterCoML.
</p>
<p>
During the two-week visit, the welcoming, inspiring, and highly supportive
research environment at the
<b><a href="https://idea-lab.uni-graz.at" target="_blank" class="link">IDea_Lab</a></b>,
together with the invaluable guidance from Hendrik Kleikamp and discussions
with Martin Holler and Bruno Viti, strengthened my ability to conduct independent
research, critically evaluate methodological choices, and collaborate in an
international research environment.
</p>
<p>
I particularly valued the opportunity to discuss questions directly, review the
numerical results collaboratively, and consider alternative approaches as the
research progressed.
</p>
<p>
Importantly, our collaboration continued beyond the STSM and led to our joint
research paper, <em><a href="https://arxiv.org/abs/2608.21132" target="_blank" class="link">
"Robust Lane-Change Intention Anticipation under Uncertainty
Based on a Recursive Bayesian Filtering Approach"
</a></em>, which is currently under review.
</p>
<p>
I am grateful to <b>COST Action InterCoML</b> for making this research visit possible,
for providing the opportunity to exchange knowledge and ideas, and for fostering
international scientific collaborations.
</p>
