import React from 'react';

export function About() {
  return (
    <div className="about-div">
      <h1>About Quizpedia & the Quiz Bowl Capstone Project</h1>

      <h2>Project Overview</h2>
      <p>
        The Quiz Bowl Capstone Project aims to modernize and streamline the management of quiz bowl competitions for 4-H participants statewide. Quizpedia provides an updated database for storing questions, answers, and necessary related information, along with automation for generating questions, detecting duplicates, and managing access levels.
      </p>
      <hr />

      <h2>Objectives</h2>
      <ul>
        <li>An updated database for all questions, answers, and necessary related information.</li>
        <li>Automated question generation for contests and rounds.</li>
        <li>Duplicate question detection.</li>
        <li>Automatic access control based on user levels.</li>
        <li>Stretch goal: Automating content analysis and question development.</li>
      </ul>
      <hr />

      <h2>Qualifications</h2>
      <p>
        <strong>Minimum Qualifications:</strong> Database Design, HTML/CSS/JS, Web Development, UI/UX Design.
      </p>
      <p>
        <strong>Preferred Qualifications:</strong> Regular Expressions, Machine Learning, Natural Language Processing.
      </p>
      <hr />

      <h2>4-H Program Information</h2>
      <p>
        4-H is a youth program provided by Oregon State University's Extension Service, offering a wide range of educational opportunities and activities.
      </p>
      <hr />

      <h2>Quizpedia Technical Information</h2>
      <p>
        Quizpedia serves as the primary interface for accessing the Quiz Bowl database. Quizpedia is built on the Azure platform using Azure Static Web Apps, Azure Functions, and Azure SQL Database. The front end is built using React, while the back end is built using Node.js.
      </p>
    </div>
  );
}
