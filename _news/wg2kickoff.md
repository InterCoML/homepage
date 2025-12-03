---
layout: news
title: "Kickoff workshop WG 2 - online"
date: 2025-12-05
short-description: "Working group 2 will have its virtual kickoff workshop on 5 December, 2025."
authors:
  - kleikamp
  - periago
---

<p>
  Working group 2 will have its virtual kickoff workshop on <b>5 December, 2025</b>.
  Everyone interested in actively participating in the working group is very much invited to join.
  The goal of the workshop is to get an overview of current topics and questions related to WG2.
  Moreover, we would like to start establishing smaller subgroups tackling specific tasks.
</p>
<p>
  Below you find the program of the workshop, information on how to participate and some files related to the meeting.
</p>

<h4>Program</h4>
All times mentioned in the table below are CET.
<table>
  <thead>
    <tr>
      <th>Time</th>
      <th>Agenda item</th>
      <th>Moderator/Speaker</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>9:00-9:15</td>
      <td>Welcome and presentation of the working group</td>
      <td>Hendrik Kleikamp/Francisco Periago</td>
    </tr>
    <tr>
      <td>9:15-9:45</td>
      <td style="width: 75%;">
        <details>
          <summary>Presentation T2.1 - Breaking the curse of dimensionality in some control and parametric problems for PDEs</summary>
          <b>Abstract:</b> The talk will address the following five issues:
          <ol>
            <li>A brief introduction to supervised learning and its application to control of PDEs via PINNs,</li>
            <li>DeepXDE: a Python library for scientific machine learning and physics-informed learning,</li>
            <li>What does curse of dimensionality mean in Machine Learning?,</li>
            <li>DeepONets: a promising tool to break the curse of dimensionality in control and parametric problems for PDEs, and</li>
            <li>Some challenging open problems in the field.</li>
          </ol>
          To make the presentation understandable to non-specialists, we will avoid most of the technical details. Interestingly, several open problems will be presented as a starting point to foster collaboration among the members of our COST Action.
        </details>
      </td>
      <td>Francisco Periago</td>
    </tr>
    <tr>
      <td>9:45-10:00</td>
      <td>Round table discussion about T2.1</td>
      <td>Francisco Periago</td>
    </tr>
    <tr>
      <td>10:00-10:20</td>
      <td>Short coffee break</td>
      <td></td>
    </tr>
    <tr>
      <td>10:20-10:50</td>
      <td style="width: 75%;">
        <details>
          <summary>Presentation T2.2 - Solving parameterised optimal control problems using machine learning</summary>
          <b>Abstract:</b> In many real-world applications, the governing dynamical systems depend on physical parameters that significantly shape their behavior. When tackling parameterised optimal control problems, this dependence introduces substantial computational challenges—particularly in multi-query scenarios, where one must repeatedly solve an optimal control problem for numerous parameter values. Making such tasks tractable requires methods that explicitly exploit the structure of the control problems and their parameter dependence.
          <p>
          In this presentation, I will survey several research directions aimed at addressing these challenges, with a particular emphasis on how machine learning techniques can be integrated into classical solution strategies. I will discuss the difficulties inherent to multi-query settings, outline emerging opportunities created by combining model-based and data-driven approaches, and highlight open questions that motivate further exploration.
          </p>
        </details>
      </td>
      <td>Hendrik Kleikamp</td>
    </tr>
    <tr>
      <td>10:50-11:05</td>
      <td>Round table discussion about T2.2</td>
      <td>Hendrik Kleikamp</td>
    </tr>
    <tr>
      <td>11:05-11:15</td>
      <td>Short coffee break</td>
      <td></td>
    </tr>
    <tr>
      <td>11:15-11:45</td>
      <td style="width: 75%;">
        <details>
          <summary>Presentation T2.3 - Computing control Lyapunov functions with neural networks</summary>
          <b>Abstract:</b> This talk will give an overview of methods that propose to use neural networks for computing control Lyapunov functions. After explaining what control Lyapunov functions are and why they are interesting, we briefly review early approaches from the 1990s and then turn to recent developments. These focus on avoiding singularities, providing formal verification, and overcoming the curse of dimensionality. The talk closes with open problems and challenges in the field.
        </details>
      </td>
      <td>Lars Grüne</td>
    </tr>
    <tr>
      <td>11:45-12:00</td>
      <td>Round table discussion about T2.3</td>
      <td>Lars Grüne</td>
    </tr>
    <tr>
      <td>12:00-13:30</td>
      <td>Lunch break</td>
      <td></td>
    </tr>
    <tr>
      <td>13:30-14:00</td>
      <td style="width: 75%;">
        <details>
          <summary>Presentation T2.4 - On the life-cycle-optimisation problems in materials and the deep neural network approach</summary>
          <b>Abstract:</b>
          Throughout the life cycle of materials, the bulk of machanical objects may lose their elastic
          properties due to the appearence of micro defects or local damage. In my short presentation I would
          like to focus on the questions as to how to exert an external influence on an elastic body in order to
          optimize a desired performance index and reduce potential damage using for that the deep neural
          network approach. Furthermore, I am also going to discuss possible ways for the correct definition
          and implementation of the new concept of sustainable controls which could help us to achieve the
          announced twofold goal.
          <p>
          In the context of above-mentioned problems, I will begin with a brief overview of the mathematical
          damage modeling. I will specifically focus on the models in which material damages can be
          described by a scalar damage field $ζ = ζ(t, x)$, which acts as an internal variable measuring the
          fractional decrease in the stress-strain response. In this case, the corresponding elasticity system
          may exhibit a degeneration. This means that, for certain damage field $ζ(t, x)$, this problem may
          lack the uniqueness of weak solutions due to the Lavrentieff phenomenon. So, one of the principal
          point at this stage is to study the solvability issues for the proposed modes and highlight some
          questions which seem to be open for nowadays.
          </p>
          <p>
          The next point, I would like to touch on, is the formulation of possible and plausible statements
          for sustainable optimal control problems within the framework of `life-cycle optimization`. Because
          of the degeneration in the principle part of differential operators and the $L^1$-properties of the
          right-hand sides of PDEs involved in the proposed models, issues of solvability and the existence of
          approximate solutions of the corresponding optimal control problems remain under-researched.
          At the end of my presentation I would like to dwell on the development of machine learning
          approach to the study and practical implementation of the aforementioned OCPs. In this context, I
          am going to discuss some issues closely related to the deep neural network application to our
          business and highlight some key questions that need to be answered.
          </p>
        </details>
      </td>
      <td>Peter Kogut</td>
    </tr>
    <tr>
      <td>14:00-14:15</td>
      <td>Round table discussion about T2.4</td>
      <td>Peter Kogut</td>
    </tr>
    <tr>
      <td>14:15-14:25</td>
      <td>Short coffee break</td>
      <td></td>
    </tr>
    <tr>
      <td>14:25-14:55</td>
      <td style="width: 75%;">
        <details>
          <summary>Presentation T2.5 - Exploiting PINNs for solving complex free boundary problems</summary>
          <b>Abstract:</b>
        </details>
      </td>
      <td>Cristina Trombetti</td>
    </tr>
    <tr>
      <td>14:55-15:10</td>
      <td>Round table discussion about T2.5</td>
      <td>Cristina Trombetti</td>
    </tr>
    <tr>
      <td>15:10-15:30</td>
      <td>Closing</td>
      <td>Hendrik Kleikamp/Francisco Periago</td>
    </tr>
  </tbody>
</table>

<h4>How to participate</h4>
The workshop will take place via <a href="https://www.zoom.com/" target="_blank" rel="noopener noreferrer" class="link">Zoom</a>.
Everyone interested in the meeting can participate using the following Zoom credentials:
<br>
<ul>
  <li><a href="https://uni-graz.zoom.us/j/63020766678?pwd=Dao3r0BEsI2xma4Hm0RORP7a8Mar9h.1" target="_blank" rel="noopener noreferrer" class="link">Zoom-Link</a></li>
  <li>Meeting-ID: 630 2076 6678</li>
  <li>Password: 440404</li>
</ul>
Please mute yourself by default during the meeting and use the "raise hand" functionality if you would like to join a discussion.
<br>
<br>
<b>Important note: We plan to record the meeting to make it available also for people that cannot participate.
If you do not want to be visible, please also make sure to turn off your camera.</b>

<h4>Documents</h4>
Here you find some files such as the presentation shown during the workshop or the list of open problems:
<ul>
  <li><a href="{{ site.baseUrl }}/files/wg2/kickoffWG2Announcement.pdf" target="_blank" rel="noopener noreferrer" class="link">Announcement slide</a></li>
  <li><a href="{{ site.baseUrl }}/files/wg2/kickoffWG2Presentation.pdf" target="_blank" rel="noopener noreferrer" class="link">Presentation</a></li>
  <li><a href="{{ site.baseUrl }}/files/wg2/kickoffWG2OpenProblems.pdf" target="_blank" rel="noopener noreferrer" class="link">List of open problems</a></li>
</ul>
