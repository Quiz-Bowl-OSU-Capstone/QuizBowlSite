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
        console.log("Filters:", response.json());
        const data = await response.json();
        console.log("Filters:", data);

        const speciesOptions = data.Species.filter(Boolean);
        const resourceOptions = data.Resource.filter(Boolean);
        const levelOptions = data.Level.filter(Boolean);
        const topicOptions = data.Topic.filter(Boolean);

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
          setRandomQuestions(data.questions);
        } else {
          console.error("Fetched data is not an array:", data.questions);
        }
      } catch (error) {
        console.error("Error fetching random questions:", error);
      }
    }

    fetchRandomQuestions();
    //fetchFilters();
  }, []);

  return (
    <div className="content-holder">
      <aside className="sidebar">
        <div className="filter-box">
          <h3 style={{ textAlign: "center" }}>Filter</h3>
          <form>
            <ul>
              <li>
                <label htmlFor="level">Level:</label>
                <select id="level">
                  {filters.level.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="species">Species:</label>
                <select id="species">
                  {filters.species.map((species, index) => (
                    <option key={index} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="resource">Resource:</label>
                <select id="resource">
                  {filters.resource.map((resource, index) => (
                    <option key={index} value={resource}>
                      {resource}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="topic">Topic:</label>
                <select id="topic">
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
              <i>Species: {question.Species} | Resource: {question.Resource} | Level: {question.Level} | Topic: {question.Topic}</i>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}