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

  const [levelFilter, setLevelFilter] = useState('nofilter');
  const [speciesFilter, setSpeciesFilter] = useState('nofilter');
  const [resourceFilter, setResourceFilter] = useState('nofilter');
  const [topicFilter, setTopicFilter] = useState('nofilter');

  async function handleClick() {
    var params = "";

    if (cookies.auth) {
      params += "?uid=" + cookies.auth.uid;
    } else {
      params += "?uid=0";
    }

    if (levelFilter != "nofilter") {
      params += "&level=" + levelFilter;
      localStorage.setItem("level", levelFilter);
    } else {
      localStorage.removeItem("level");
    }

    if (speciesFilter != "nofilter") {
      params += "&species=" + speciesFilter;
      localStorage.setItem("species", speciesFilter);
    } else {
      localStorage.removeItem("species");
    }

    if (resourceFilter != "nofilter") {
      params += "&resource=" + resourceFilter;
      localStorage.setItem("resource", resourceFilter);
    } else {
      localStorage.removeItem("resource");
    }

    if (topicFilter != "nofilter") {
      params += "&topic=" + topicFilter;
      localStorage.setItem("topic", topicFilter);
    } else {
      localStorage.removeItem("topic");
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

  function AccountStatus({ user, filters }) {
    if (user != undefined && user.uid > 0) {
      return (
        <div>
          <p>
            You're logged in as <strong>{cookies.auth.username}</strong>.
          </p>
          <button id="login-button" onClick={() => { removeCookie("auth"); window.location.reload() }}>
            Log out
          </button>
          <h3 style={{ textAlign: "center" }}>Filters</h3>
          <p>
            Select checkboxes to enable/disable filters. Use drop down menus to
            adjust filter settings.
          </p>
          <form>
            <ul>
              <li>
                <label htmlFor="level">
                  Level:
                  <select id="level" className="select-box" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                    <option value="nofilter">-- No Filter --</option>
                    {filters.level.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                </select>
                </label>
              </li>
              <li>
                <label htmlFor="species">
                  Species:
                  <select id="species" className="select-box" value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)}>
                    <option value="nofilter">-- No Filter --</option>
                    {filters.species.map((species, index) => (
                      <option key={index} value={species}>
                        {species}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                <label htmlFor="resource">
                  Resource:
                  <select id="resource" className="select-box" value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)}>
                    <option value="nofilter">-- No Filter --</option>
                    {filters.resource.map((resource, index) => (
                      <option key={index} value={resource}>
                        {resource}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                <label htmlFor="topic">
                  Topic:
                  <select id="topic" className="select-box" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
                    <option value="nofilter">-- No Filter --</option>
                    {filters.topic.map((topic, index) => (
                      <option key={index} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            </ul>
          </form>
          <button id="gen-questions" onClick={handleClick}>
            Generate Questions
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <p>
            You are not logged in. Please log in to view questions.
          </p>
          <button id="login-button" onClick={() => { window.location.href="/login" }}>
            Login
          </button>
        </div>
      )
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
        localStorage.setItem("questions", JSON.stringify(data.questions));
        localStorage.setItem("lastuser", cookies.auth.uid);
        localStorage.setItem("lastfetched", new Date().getTime() / 1000);
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

        if (
        localStorage.questions && 
        localStorage.lastuser && 
        localStorage.lastfetched && 
        localStorage.lastuser == cookies.auth.uid && 
        (new Date().getTime() / 1000 - localStorage.lastfetched) < 3600) {
          console.log("Found cached questions.");
          setRandomQuestions(JSON.parse(localStorage.questions));

          if (localStorage.level) {
            console.log("Setting level to", localStorage.level);
            document.getElementById("level-enabled").checked = true;
            document.getElementById("level").value = localStorage.level;
          }

          if (localStorage.species) {
            console.log("Setting species to", localStorage.species);
            document.getElementById("species-enabled").checked = true;
            document.getElementById("species").value = localStorage.species;
          }

          if (localStorage.resource) {
            console.log("Setting resource to", localStorage.resource);
            document.getElementById("resource-enabled").checked = true;
            document.getElementById("resource").value = localStorage.resource;
          }

          if (localStorage.topic) {
            console.log("Setting topic to", localStorage.topic);
            document.getElementById("topic-enabled").checked = true;
            document.getElementById("topic").value = localStorage.topic;
          }

        } else if (localStorage.questions && localStorage.lastuser) {
          localStorage.clear();
        }
      }
    } catch (error) {
      console.log(error);
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
              and it should be faster afterwards.
            </p>
            <AccountStatus user={cookies.auth} filters={filters} />
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
