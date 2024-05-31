import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import { useCookies } from "react-cookie";
import "../components/questioncard.css";
import QuestionSheet from "../components/QuestionSheet.jsx";

// The main function for the QuizBowl page, which is the main page of the Quizpedia application.
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

  const [levelFilter, setLevelFilter] = useState("nofilter");
  const [speciesFilter, setSpeciesFilter] = useState("nofilter");
  const [resourceFilter, setResourceFilter] = useState("nofilter");
  const [topicFilter, setTopicFilter] = useState("nofilter");
  const [savedDate, setSavedDate] = useState("");

  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");

  // Handles the change event for the CSV file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
    setCsvFileName(file ? file.name : "");
  };

  // Imports CSV file data and processes it
  const handleImportCSV = async () => {
    if (csvFile) {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const csvData = result.data;
          console.log("Parsed CSV data:", csvData);
          // API to save the data to the database
          try {
            const response = await fetch(
              "https://qzblapi.azurewebsites.net/api/AddQuestions?uid=" +
                cookies.auth.uid +
                "&questions=" +
                encodeURIComponent(JSON.stringify(csvData))
            );
            if (response.ok) {
              alert("Questions imported successfully!");
            } else {
              alert("Failed to import questions.");
            }
          } catch (error) {
            console.error("Error importing questions:", error);
            alert("An error occurred while importing questions.");
          }
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
          alert("Failed to parse CSV file.");
        },
      });
    } else {
      alert("Please select a CSV file to import.");
    }
  };

  // Prepares and returns CSV data for export
  function handleExportCSV() {
    const csvData = randomQuestions.map((question) => ({
      Question: question.Question,
      Answer: question.Answer,
      Topic: question.Topic.toUpperCase(),
      Species: question.Species.toUpperCase(),
      Resource: question.Resource,
      Level: question.Level.toUpperCase(),
    }));

    return csvData;
  }

  // Clears all questions and related local storage data
  function clearQuestions() {
    setRandomQuestions([]);

    localStorage.removeItem("questions");
    localStorage.removeItem("lastuser");
    localStorage.removeItem("lastfetched");
    localStorage.removeItem("level");
    localStorage.removeItem("species");
    localStorage.removeItem("resource");
    localStorage.removeItem("topic");
    localStorage.removeItem("lastusedbefore");

    setLevelFilter("nofilter");
    setSpeciesFilter("nofilter");
    setResourceFilter("nofilter");
    setTopicFilter("nofilter");
    setSavedDate("");
  }

  // Fetches a single random question from the backend
  async function fetchSingleQuestion() {
    var params = "?uid=" + cookies.auth.uid;

    if (localStorage.getItem("level")) {
      params += "&level=" + localStorage.getItem("level");
    }

    if (localStorage.getItem("species")) {
      params += "&species=" + localStorage.getItem("species");
    }

    if (localStorage.getItem("resource")) {
      params += "&resource=" + localStorage.getItem("resource");
    }

    if (localStorage.getItem("topic")) {
      params += "&topic=" + localStorage.getItem("topic");
    }

    if (localStorage.getItem("date")) {
      params += "&date=" + encodeURIComponent(date);
    }

    params += "&amt=1";

    var ids = [];
    randomQuestions.forEach((question) => {
      ids.push(question.id);
    });
    params += "&exclude=" + encodeURIComponent(JSON.stringify(ids));

    try {
      const response = await fetch(
        "https://qzblapi.azurewebsites.net/api/PickRandomQuestions" + params
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filters");
      }
      const data = await response.json();
      if (data.questions.length > 0) {
        return data.questions[0];
      } else {
        return null;
      }
    } catch (e) {
      console.log("Error replacing question: " + e);
    }
  }

  // Deletes a question from the database
  async function deleteQuestion(qid) {
    var deleteURL =
      "https://qzblapi.azurewebsites.net/api/RemoveQuestions?uid=" +
      cookies.auth.uid +
      "&ids=" +
      encodeURIComponent(JSON.stringify([qid]));
    const response = await fetch(deleteURL);
    if (!response.ok) {
      throw new Error("Failed to update lastUsage");
    }
    data = await response.json();
  }

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

    if (document.getElementById("last-used-before-date").value) {
      var date = new Date(
        document.getElementById("last-used-before-date").value
      )
        .toISOString()
        .substring(0, 10);

      params += "&date=" + encodeURIComponent(date);
      localStorage.setItem("date", date);
    } else {
      localStorage.removeItem("date");
    }

    fetchRandomQuestions(params);
  }

  // Handles the click event for a question card
  function handleQuestionClick(question) {
    setSelectedQuestion((prevQuestion) => {
      if (prevQuestion && prevQuestion.id === question.id) {
        return null;
      } else {
        return question;
      }
    });
  }

  // Function to handle moving questions up or down in the list
  function handleMove(moveDir, index, qid) {
    if (moveDir === "up") {
      if (index === 0) {
        return;
      }
      const newQuestions = [...randomQuestions];
      const temp = newQuestions[index];
      newQuestions[index] = newQuestions[index - 1];
      newQuestions[index - 1] = temp;
      setRandomQuestions(newQuestions);
      setSelectedQuestion(qid);
    } else if (moveDir === "down") {
      if (index === randomQuestions.length - 1) {
        return;
      }
      const newQuestions = [...randomQuestions];
      const temp = newQuestions[index];
      newQuestions[index] = newQuestions[index + 1];
      newQuestions[index + 1] = temp;
      setRandomQuestions(newQuestions);
      setSelectedQuestion(qid);
    }
  }

  // Function to handle edit button click
  function handleEditClick(qid, index) {
    setCookie("editQuestion", {
      index: index,
    });
    window.location.href = "/edit";
  }

  // Function to handle replace button click
  function handleReplaceClick(qid, index) {
    if (
      window.confirm(
        "By clicking OK, you are going to replace this question with a new randomly-selected question from the database. Are you sure?"
      )
    ) {
      console.log("Confirmed replace operation with ID" + qid);

      document.getElementById("q-operation-loading").style.display = "flex";
      fetchSingleQuestion().then((newQuestion) => {
        if (newQuestion != null) {
          var questions = randomQuestions.filter(
            (question) => question.id != qid
          );
          questions.splice(index, 0, newQuestion);

          setRandomQuestions(questions);
          setSelectedQuestion(newQuestion.id);
          localStorage.setItem("questions", JSON.stringify(questions));
          localStorage.setItem("lastuser", cookies.auth.uid);
          localStorage.setItem("lastfetched", new Date().getTime() / 1000);
        } else {
          window.alert(
            "Failed to replace question. This could be because there are not enough questions in the database with similar filters, or because of a network error."
          );
          document.getElementById("q-operation-loading").style.display = "none";
        }
      });
    }
  }

  // Function to handle delete button click
  function handleDeleteClick(qid) {
    if (
      window.confirm(
        "By clicking OK, you are going to permanently delete this question from both this list and the database. Are you sure?"
      )
    ) {
      console.log("Confirmed delete operation with ID" + qid);

      document.getElementById("q-operation-loading").style.display = "flex";
      fetchSingleQuestion().then((newQuestion) => {
        var questions = randomQuestions.filter(
          (question) => question.id != qid
        );

        if (newQuestion != null) {
          questions.splice(index, 0, newQuestion);
        } else {
          window.alert(
            "Failed to replace question. This could be because there are not enough questions in the database with similar filters, or because of a network error."
          );
        }

        setRandomQuestions(questions);
        setSelectedQuestion(newQuestion.id);
        localStorage.setItem("questions", JSON.stringify(questions));
        localStorage.setItem("lastuser", cookies.auth.uid);
        localStorage.setItem("lastfetched", new Date().getTime() / 1000);
      });

      deleteQuestion(qid);
    }
  }

  // Prompts the user for marking questions as used on download and performs the update
  async function handleQuestionDownload() {
    let event = prompt(
      "Do you want to mark these questions as being used on today's date?\n\nClicking OK will mark the downloaded questions as having been last used on today's date. Clicking Cancel will not mark the questions as used, but will still download the questions to your computer.\n\nYou can optionally enter an event name for recordkeeping purposes, but this is not required.",
      ""
    );

    if (event != null) {
      var eventName = event.trim();
      var questionIDs = randomQuestions.map((question) => question.id);

      const response = await fetch(
        "https://qzblapi.azurewebsites.net/api/LastUsage?uid=" +
          cookies.auth.uid +
          "&ids=" +
          encodeURIComponent(JSON.stringify(questionIDs)) +
          "&event=" +
          encodeURIComponent(eventName)
      );
      if (!response.ok) {
        throw new Error("Failed to update lastUsage");
      }
      const data = await response.json();

      console.log(data);
    }
  }

  // Initiates download of current question set as a CSV file
  function handleDownloadCSV() {
    try {
      const csvData = handleExportCSV();
      const csvFilename = `quizpedia-${
        cookies.auth.username
      }-${new Date().toLocaleDateString()}.csv`;
      const csvBlob = new Blob([Papa.unparse(csvData)], {
        type: "text/csv;charset=utf-8;",
      });
      const csvUrl = window.URL.createObjectURL(csvBlob);
      const tempLink = document.createElement("a");
      tempLink.href = csvUrl;
      tempLink.setAttribute("download", csvFilename);
      tempLink.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  }

  // Displays account status and filtering options in the sidebar
  function AccountStatus({ user, filters }) {
    if (user != undefined && user.uid > 0) {
      return (
        <div>
          <h3 style={{ textAlign: "center" }}>Instructions</h3>
          <p>
            Use drop down boxes and date selectors to enable or disable filters.
            Click the "Generate Questions" button to get a list of questions
            based on the filters you've selected, or click Download PDF in order
            to download a PDF of the currently shown questions.
          </p>
          <form>
            <ul>
              <li>
                <label htmlFor="level">
                  Level:
                  <select
                    id="level"
                    className="select-box"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                  >
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
                  <select
                    id="species"
                    className="select-box"
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                  >
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
                  <select
                    id="resource"
                    className="select-box"
                    value={resourceFilter}
                    onChange={(e) => setResourceFilter(e.target.value)}
                  >
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
                  <select
                    id="topic"
                    className="select-box"
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                  >
                    <option value="nofilter">-- No Filter --</option>
                    {filters.topic.map((topic, index) => (
                      <option key={index} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                <label htmlFor="date">
                  Last Used Before:
                  <input
                    type="date"
                    className="select-box"
                    id="last-used-before-date"
                    value={savedDate}
                    onChange={(e) => setSavedDate(e.target.value)}
                  />
                </label>
              </li>
            </ul>
          </form>
          <button
            className="mainbutton"
            id="clear-questions"
            onClick={clearQuestions}
          >
            Clear
          </button>
          <button
            className="mainbutton"
            id="gen-questions"
            onClick={handleClick}
          >
            Generate Questions
          </button>
          <button
            id="gen-pdf"
            className="pdfbutton"
            onClick={handleQuestionDownload}
          >
            <PDFDownloadLink
              document={
                <QuestionSheet
                  questions={randomQuestions}
                  username={cookies.auth.username}
                  datetime={new Date().toLocaleString()}
                />
              }
              fileName={
                "quizpedia-" +
                cookies.auth.username +
                "-" +
                new Date().toLocaleDateString()
              }
              style={{
                fontFamily: "Exo, sans-serif",
                fontSize: "16px",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              Download as PDF
            </PDFDownloadLink>
          </button>
          <button id="gen-csv" onClick={handleDownloadCSV}>
            Download as CSV
          </button>
          <hr />
          {cookies.auth.admin ? (
            <div>
              <h3 style={{ textAlign: "center" }}>More Options</h3>
              <button
                id="data-integrity-page"
                onClick={() => {
                  window.location.href = "/missinginfo";
                }}
              >
                Fill In Missing Data
              </button>
              <button
                id="data-integrity-page"
                onClick={() => {
                  window.location.href = "/duplicates";
                }}
              >
                Flag Duplicate Questions
              </button>
              <p>
                To import a CSV file, select the CSV file and then click "Import
                CSV".
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="select-box"
              />
              <button onClick={handleImportCSV}>Import CSV</button>
              {csvFileName && <p>Selected file: {csvFileName}</p>}
              <p>
                Note: Questions must be in the correct format to be imported
                with a CSV file.{" "}
                <a className="silentlink" href="/quizpedia-template.csv">
                  Click here to download a CSV template
                </a>
                .
              </p>
              <hr />
            </div>
          ) : (
            ""
          )}
          <p>
            You're logged in as <strong>{cookies.auth.username}</strong>.
          </p>
          {cookies.auth.admin ? (
            <button
              id="manage-accounts-button"
              onClick={() => {
                window.location.href = "/manageaccounts";
              }}
              className="mainbutton"
            >
              Manage Accounts
            </button>
          ) : (
            ""
          )}
          <button
            id="login-button"
            onClick={() => {
              removeCookie("auth");
              window.location.reload();
            }}
            className="mainbutton"
          >
            Log out
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <h4>You're not logged in.</h4>
          <p>Please log in to view questions and use the Quizpedia software.</p>
          <button
            id="login-button"
            onClick={() => {
              window.location.href = "/login";
            }}
            className="mainbutton"
          >
            Login
          </button>
        </div>
      );
    }
  }

  // Renders a display of questions, handling interactions like clicking on a question card
  function QuestionDisplay({}) {
    return (
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
              <i>
                Level: {question.Level} | Species: {question.Species} | Topic:{" "}
                {question.Topic}
              </i>
            </p>
            {/* Additional information that is shown when a card is clicked */}
            {selectedQuestion && selectedQuestion.id === question.id && (
              <div className="question-info-holder">
                <p>
                  Resource: {question.Resource} | ID: {question.id}
                  <br />
                  Last Used: {question.lastusagedate} | Last Event Used At:{" "}
                  {question.lastusageevent}
                </p>
                <img
                  src="loading.gif"
                  alt="Loading..."
                  id="q-operation-loading"
                  className="loading-symbol"
                />
                <div>
                  <button
                    className="action-buttons-icon"
                    onClick={() => {
                      handleMove("up", index, question.id);
                    }}
                  >
                    <img src="/chevron.png" className="icon-rotated" />
                  </button>
                  <button
                    className="action-buttons-icon"
                    onClick={() => {
                      handleMove("down", index, question.id);
                    }}
                  >
                    <img src="/chevron.png" className="icon" />
                  </button>
                  {/* Edit button */}
                  {cookies.auth.admin ? (
                    <button
                      className="action-buttons"
                      onClick={() => {
                        handleEditClick(question.id, index);
                      }}
                      title="Edit this question. Changes are saved to the database."
                    >
                      Edit
                    </button>
                  ) : (
                    ""
                  )}
                  {/* Remove button */}
                  {randomQuestions.length < 12 ? (
                    <button
                      className="action-buttons"
                      disabled={true}
                      title="This button is disabled because there are no other questions in the database to replace this question with."
                    >
                      Replace
                    </button>
                  ) : (
                    <button
                      className="action-buttons"
                      onClick={() => {
                        handleReplaceClick(question.id, index);
                      }}
                      title="Replace this question with a new randomly picked one."
                    >
                      Replace
                    </button>
                  )}
                  {/* Delete button */}
                  {cookies.auth.admin ? (
                    <button
                      className="buttons-dark"
                      onClick={() => {
                        handleDeleteClick(question.id);
                      }}
                      title="Delete this question from the database and replace it with a new randomly picked one."
                    >
                      Delete
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {cookies.auth == undefined ? (
          <div>
            <div class="row">
              <div class="column">
                <h1>Welcome to Quizpedia!</h1>
                <img
                  src="quizpediademo.jpg"
                  alt="Quizpedia Demo"
                  className="marketing"
                />
                <p>
                  Quizpedia automates question generation, making it a snap to
                  randomly pick questions out. It even includes the ability to
                  filter them by multiple data points, track when each question
                  was last used, and easily correct questions with missing data.
                  Quizpedia also allows quizmasters to import and export
                  questions as CSV or PDF files, which allows them to easily
                  print out, share, or add questions to the database without
                  having to manually transfer generated questions to another
                  sheet. In fact, Quizpedia allows questions to be added either
                  from its web interface or from an imported sheet of questions!
                </p>
                <h3>Why use Quizpedia?</h3>
                <p>
                  Quizmasters at Oregon State University’s 4-H youth development
                  program previously employed an Excel spreadsheet to store a
                  massive amount of questions that were used for the quiz bowl
                  events they put on. This sheet was difficult to navigate, and
                  required a person to manually go through and pick out
                  questions to ask at these quiz bowl events. As a result, it
                  was time consuming to prepare for these events. The sheet also
                  often contained duplicate or incorrect information, and it was
                  difficult to truly randomize data from the table.
                </p>
                <p>
                  Quizpedia automates question storage, retrival, randomization,
                  and cataloging. Questions can be shared more easily and the
                  database keeps a central record of which questions were used
                  and for which events. Quizpedia also can be accessed from
                  anywhere, making it easier to use it on the go and with
                  different users. Quizpedia is also designed to be lightweight,
                  low-cost, and fit the needs of 4-H quizmasters, so it is
                  customized to the needs of the program.
                </p>
                <h3>How does it work?</h3>
                <p>
                  Quizpedia is built on the Azure Cloud Platform. Our goals were
                  to design a system that is low-cost, easy to maintain and
                  reliable, so we chose to use a serverless architecture in
                  development. Quizpedia is comprised of three separate parts -
                  the website itself, a central API, and the database which
                  stores the question data.
                </p>
              </div>
              <div class="column">
                <h3>How do I use Quizpedia?</h3>
                <p>
                  Users will need to log into the website using the login button
                  on the top left side of the page. If you need an account,
                  please email Candi Bothum at bothumca@oregonstate.edu
                </p>
                <p>
                  Once logged in, the left sidebar shows options for filtering,
                  retrieving, and downloading questions. Users can select
                  filters to narrow down the questions they want to generate.
                  Clicking the "Generate Questions" button will fetch a list of
                  questions based on the filters selected. From there, users can
                  can view the questions on the page and download them as a PDF
                  or CSV file.
                </p>
                <p>
                  The left sidebar will also show options for users to help
                  improve the quality of question data, by filling missing data
                  fields or flagging duplicate questions. If you have spare time
                  and want to help the project in some way, this is a good way
                  to do so!
                </p>
                <h3>I need help!</h3>
                <p>
                  As our project is still under development currently, Aura
                  Fairchild is the primary contact for Quizpedia
                  (fairchau@oregonstate.edu). When emailing, please include your
                  name and a detailed description of what you were trying to do,
                  and the error message (if any). For help inquiries after June
                  7th, please reach out to our project partner for Quizpedia,
                  Candi Bothum, at bothumca@oregonstate.edu.
                </p>
                <h3>More Info / Useful Links</h3>
                <ul>
                  <li>
                    <a href="https://github.com/Quiz-Bowl-OSU-Capstone/Quiz-Bowl">
                      Quizpedia API Github Repository (for codebase and
                      technical documentation)
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/Quiz-Bowl-OSU-Capstone/QuizBowlSite">
                      Quizpedia Website Github Repository (for codebase and
                      technical documentation)
                    </a>
                  </li>
                </ul>
                <h4>Authors</h4>
                <ul>
                  <li>Aura Fairchild</li>
                  <li>Daksh Viradiya</li>
                  <li>Jay Shah</li>
                  <li>Ricardo Gonzalez</li>
                </ul>
                <h4>Contributors</h4>
                <ul>
                  <li>Candi Bothum - Project Partner</li>
                  <li>Lucas Turpin - IT Contact</li>
                  <li>Kirsten Winters - Capstone Professor</li>
                  <li>Alex Ulbrich - Capstone Professor</li>
                </ul>
              </div>
            </div>
            <h5>Launched in Beaver Nation on June 7th.</h5>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  // Fetches a list of random questions based on the current filter settings
  async function fetchRandomQuestions(params) {
    try {
      document.getElementById("gen-questions").setAttribute("disabled", "true");
      var fullURL =
        "https://qzblapi.azurewebsites.net/api/PickRandomQuestions" + params;
      const response = await fetch(fullURL);
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

          if (data.questions[i].lastusagedate == null) {
            data.questions[i].lastusagedate = "N/A";
          } else {
            data.questions[i].lastusagedate = new Date(
              data.questions[i].lastusagedate
            ).toLocaleDateString();
          }

          if (data.questions[i].lastusageevent == null) {
            data.questions[i].lastusageevent = "N/A";
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

  // Effect hook for initializing and loading data when the component mounts
  useEffect(() => {
    async function fetchFilters() {
      try {
        document
          .getElementById("gen-questions")
          .setAttribute("disabled", "true");
        const response = await fetch(
          "https://qzblapi.azurewebsites.net/api/SearchFilters?uid=" +
            cookies.auth.uid
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
          new Date().getTime() / 1000 - localStorage.lastfetched < 3600
        ) {
          console.log("Found cached questions.");
          setRandomQuestions(JSON.parse(localStorage.questions));

          if (localStorage.level) {
            console.log("Setting level to", localStorage.level);
            setLevelFilter(localStorage.level);
          }

          if (localStorage.species) {
            console.log("Setting species to", localStorage.species);
            setSpeciesFilter(localStorage.species);
          }

          if (localStorage.resource) {
            console.log("Setting resource to", localStorage.resource);
            setResourceFilter(localStorage.resource);
          }

          if (localStorage.topic) {
            console.log("Setting topic to", localStorage.topic);
            setTopicFilter(localStorage.topic);
          }

          if (localStorage.date) {
            console.log("Setting date to", localStorage.date);
            setSavedDate(localStorage.date);
          }
        } else {
          localStorage.clear();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Main component return function rendering the application UI with various interactive components
  return (
    <div className="main-holder">
      <div className="content-holder">
        <aside className="sidebar">
          <div className="filter-box">
            <AccountStatus user={cookies.auth} filters={filters} />
          </div>
        </aside>
      </div>
      <QuestionDisplay />
    </div>
  );
}
