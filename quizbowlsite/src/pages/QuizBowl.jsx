import React, { useState, useEffect } from "react";

export function QuizBowl() {
  const [filters, setFilters] = useState({
    species: [],
    resource: [],
    level: [],
    topic: [],
  });

  const [randomQuestions, setRandomQuestions] = useState([]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch(
          "https://qzblapi.azurewebsites.net/api/SearchFilters?uid=1"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch filters");
        }
        const data = await response.json();

        var speciesOptions = data.Species.filter(Boolean);
        var resourceOptions = data.Resource.filter(Boolean);
        var levelOptions = data.Level.filter(Boolean);
        var topicOptions = data.Topic.filter(Boolean);

        setFilters({
          species: speciesOptions,
          resource: resourceOptions,
          level: levelOptions,
          topic: topicOptions,
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    }

    async function fetchRandomQuestions() {
      try {
        const response = await fetch(
          "https://qzblapi.azurewebsites.net/api/PickRandomQuestions?uid=1"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch random questions");
        }
        const data = await response.json();
        if (Array.isArray(data.questions)) {
          for (var i = 0; i < data.questions.length; i++) {
            if (data.questions[i].Topic == null) {
              data.questions[i].Topic = "N/A";
            }
            if (data.questions[i].Resource == null) {
              data.questions[i].Resource = "N/A";
            }
            if (data.questions[i].Species == null) {
              data.questions[i].Species = "N/A";
            }
            if (data.questions[i].Level == null) {
              data.questions[i].Level = "N/A";
            }
          }
          setRandomQuestions(data.questions);
        } else {
          console.error("Fetched data is not an array:", data.questions);
        }
      } catch (error) {
        console.error("Error fetching random questions:", error);
      }
    }

    fetchRandomQuestions();
    fetchFilters();
  }, []);

  return (
    <div className="content-holder">
      <aside className="sidebar">
        <div className="filter-box">
          <h3 style={{ textAlign: "center" }}>Filter</h3>
          <form>
            <ul>
              <li>
                <label htmlFor="level">Level<br /></label>
                <select id="level" className="select-box">
                  {filters.level.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="species">Species<br /></label>
                <select id="species" className="select-box">
                  {filters.species.map((species, index) => (
                    <option key={index} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="resource">Resource<br /></label>
                <select id="resource" className="select-box">
                  {filters.resource.map((resource, index) => (
                    <option key={index} value={resource}>
                      {resource}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="topic">Topic<br /></label>
                <select id="topic" className="select-box">
                  {filters.topic.map((topic, index) => (
                    <option key={index} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </form>
        </div>
      </aside>
      <div className="question-holder">
        <h2>Questions</h2>
        <ol>
          {randomQuestions.map((question, index) => (
            <li key={index} className="question-individual">
              <strong>{question.Question}</strong>
              <br />
              Answer: {question.Answer}
              <br />
              <i>Level: {question.Level} &nbsp; | &nbsp; Species: {question.Species} &nbsp; | &nbsp; Topic: {question.Topic} &nbsp; | &nbsp; Resource: {question.Resource}</i>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}