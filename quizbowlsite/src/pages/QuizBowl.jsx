import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "../components/questioncard.css";

export function QuizBowl() {
  var [filters, setFilters] = useState({
    species: ["Loading..."],
    resource: ["Loading..."],
    level: ["Loading..."],
    topic: ["Loading..."],
  });
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [randomQuestions, setRandomQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  async function handleClick() {
    var params = "";

    if (cookies.auth.uid > 0) {
      params += "?uid=" + cookies.auth.uid;
    } else {
      params += "?uid=0";
    }

    if (document.getElementById("level-enabled").checked) {
      params += "&level=" + document.getElementById("level").value;
    }

    if (document.getElementById("species-enabled").checked) {
      params += "&species=" + document.getElementById("species").value;
    }

    if (document.getElementById("resource-enabled").checked) {
      params += "&resource=" + document.getElementById("resource").value;
    }

    if (document.getElementById("topic-enabled").checked) {
      params += "&topic=" + document.getElementById("topic").value;
    }

    fetchRandomQuestions(params);
  }

  function handleQuestionClick(question) {
    setSelectedQuestion((prevQuestion) => {
      if (prevQuestion && prevQuestion.id === question.id) {
        return null;
      } else {
        return question;
      }
    });
  }

  // Function to handle edit button click
  function handleEditClick() {
    // Edit
  }

  function handleReplaceClick() {
    if (window.confirm("By clicking OK, you are going to replace this question with a new randomly-selected question from the database. Are you sure?")) {
      console.log("Confirmed replace operation.");
      // Put code here to replace that question.
    }
  }

  // Function to handle delete button click
  function handleDeleteClick() {
    if (window.confirm("By clicking OK, you are going to permanently delete this question from both this list and the database. Are you sure?")) {
      console.log("Confirmed delete operation.");
      // Put code here to delete that question.
    }
  }

  async function fetchRandomQuestions(params) {
    try {
      document.getElementById("gen-questions").setAttribute("disabled", "true");
      const response = await fetch(
        "https://qzblapi.azurewebsites.net/api/PickRandomQuestions" +
          params
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
        document.getElementById("gen-questions").removeAttribute("disabled");
      } else {
        console.error("Fetched data is not an array:", data.questions);
      }
    } catch (error) {
      console.error("Error fetching random questions:", error);
    }
  }

  useEffect(() => {
    async function fetchFilters() {
      try {
        document
          .getElementById("gen-questions")
          .setAttribute("disabled", "true");
        const response = await fetch(
          "https://qzblapi.azurewebsites.net/api/SearchFilters?uid=" + cookies.auth.uid
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

        document.getElementById("gen-questions").removeAttribute("disabled");
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    }
    
    try {
      if (cookies.auth.uid > 0) {
        fetchFilters();
      }
    } catch (error) {
      document.getElementById("gen-questions").setAttribute("disabled", "true")
    }
  }, []);

  return (
    <div className="main-holder">
      <div className="content-holder">
        <aside className="sidebar">
          <div className="filter-box">
            <h3 style={{ textAlign: "center" }}>Important Information</h3>
            <p>
              If this is the first time in a while that you are using this
              website, it may take a long time to load initially. This is normal
              and it should be faster afterwards
            </p>
            <p>
              You need to log into the website in order to load questions on this
              page. If you are not logged in, please do so now.
            </p>
            <h3 style={{ textAlign: "center" }}>Filters</h3>
            <p>
              Select checkboxes to enable/disable filters. Use drop down menus to
              adjust filter settings.
            </p>
            <form>
              <ul>
                <li>
                  <label htmlFor="level">
                    Level
                    <br />
                  </label>
                  <input
                    type="checkbox"
                    className="inputbox"
                    id="level-enabled"
                    name="Level"
                  />
                  <select id="level" className="select-box">
                    {filters.level.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <label htmlFor="species">
                    Species
                    <br />
                  </label>
                  <input
                    type="checkbox"
                    className="inputbox"
                    id="species-enabled"
                    name="Species"
                  />
                  <select id="species" className="select-box">
                    {filters.species.map((species, index) => (
                      <option key={index} value={species}>
                        {species}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <label htmlFor="resource">
                    Resource
                    <br />
                  </label>
                  <input
                    type="checkbox"
                    className="inputbox"
                    id="resource-enabled"
                    name="Resource"
                  />
                  <select id="resource" className="select-box">
                    {filters.resource.map((resource, index) => (
                      <option key={index} value={resource}>
                        {resource}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <label htmlFor="topic">
                    Topic
                    <br />
                  </label>
                  <input
                    type="checkbox"
                    className="inputbox"
                    id="topic-enabled"
                    name="Topic"
                  />
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
            <button id="gen-questions" onClick={handleClick}>
              Generate Questions
            </button>
          </div>
        </aside>
      </div>
      <div className="question-holder">
        {randomQuestions.map((question, index) => (
          <div
            key={index}
            className="question-card"
            onClick={() => handleQuestionClick(question)}
          >
            <p>
              <strong>{question.Question}</strong>
              <br />
              Answer: {question.Answer}
              <br />
              <i>Level: {question.Level} | Species: {question.Species} | Topic:{" "}
                  {question.Topic}</i>
            </p>
            {/* Additional information that is shown when a card is clicked */}
            {selectedQuestion && selectedQuestion.id === question.id && (
              <div className="question-info-holder">
                <p>
                  Resource: {question.Resource} | ID:{" "}
                  {question.id}
                </p>
                <div>
                  {/* Edit button */}
                  <button className="action-buttons" onClick={() => { handleEditClick() }}>Edit</button>
                  {/* Remove button */}
                  <button className="action-buttons" onClick={() => { handleReplaceClick() }}>Replace</button>
                  {/* Delete button */}
                  <button className="buttons-dark" onClick={() => { handleDeleteClick() }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
