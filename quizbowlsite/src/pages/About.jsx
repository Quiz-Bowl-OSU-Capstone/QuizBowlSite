import React from 'react';

export function About() {
  return (
    <div className="about-div">
      <h1>About the Quiz Bowl Capstone Project</h1>

      <h2>Project Overview:</h2>
      <p>
        The Quiz Bowl Capstone Project aims to modernize and streamline the management of quiz bowl competitions for 4-H participants statewide. It provides an updated database for storing questions, answers, and necessary related information, along with automation for generating questions, detecting duplicates, and managing access levels.
      </p>
      <hr />

      <h2>Objectives:</h2>
      <ul>
        <li>An updated database for all questions, answers, and necessary related information.</li>
        <li>Automated question generation for contests and rounds.</li>
        <li>Duplicate question detection.</li>
        <li>Automatic access control based on user levels.</li>
        <li>Stretch goal: Automating content analysis and question development.</li>
      </ul>
      <hr />

      <h2>Motivations:</h2>
      <p>
        The project aims to improve upon the current labor-intensive process of managing quiz bowl competitions. By automating tasks such as question generation, duplicate detection, and access control, the system aims to save time and improve efficiency for quizmasters and participants alike.
      </p>
      <hr />

      <h2>Qualifications:</h2>
      <p>
        <strong>Minimum Qualifications:</strong> Database Design, HTML/CSS/JS, Web Development, UI/UX Design.
      </p>
      <p>
        <strong>Preferred Qualifications:</strong> Regular Expressions, Machine Learning, Natural Language Processing.
      </p>
      <hr />

      <h2>4-H Program Information:</h2>
      <p>
        4-H is a youth program provided by Oregon State University's Extension Service, offering a wide range of educational opportunities and activities.
      </p>
      <hr />

      <h2>Website Technical Information:</h2>
      <p>
        This website serves as the front-end interface for accessing the Quiz Bowl database. It provides a user-friendly interface for quizmasters to manage quiz questions and competitions efficiently.
      </p>

      <style>
        {`
          body, html {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .about-div {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 20px;
            background-color: #f9f9f9;
          }

          h1, h2, h3 {
            color: #444444;
            text-align: left;
          }

          hr {
            border: none;
            border-top: 1px solid #ddd;
            width: 100%;
            margin: 20px 0;
          }

          ul {
            list-style: none;
            padding: 0;
          }

          li {
            margin-bottom: 10px;
          }

          p {
            line-height: 1.6;
          }

          strong {
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
}
