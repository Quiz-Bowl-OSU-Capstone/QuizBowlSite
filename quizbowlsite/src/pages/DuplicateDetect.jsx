import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";

export function DuplicateDetect() { 
    const [randomQuestions, setRandomQuestions] = React.useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [autocompleteRender, setAutoCompletedRender] = React.useState(false);

    const newQuestion = React.useRef(null);
    const newAnswer = React.useRef(null);
    const newLevel = React.useRef(null);
    const newSpecies = React.useRef(null);
    const newTopic = React.useRef(null);
    const newResource = React.useRef(null);
    const newLastUsedDate = React.useRef(null);
    const newLastUsedEvent = React.useRef(null);

    async function removeDuplicates() {
        if (newLevel.current.value == "" || newTopic.current.value == "" || newSpecies.current.value == "" || newResource.current.value == "" || newLastUsedDate.current.value == "" || newLastUsedEvent.current.value == "") {
            if (!window.confirm("You have left some fields blank. Are you sure you want to continue?")) {
                return;
            }
        }

        document.getElementById("duplicate-loading").style.display = "flex";
        document.getElementById("fetch-duplicates").setAttribute("disabled", "true");

        var newq = {
            question: newQuestion.current.value.trim(),
            answer: newAnswer.current.value.trim(),
            level: newLevel.current.value.trim(),
            topic: newTopic.current.value.trim(),
            species: newSpecies.current.value.trim(),
            resource: newResource.current.value.trim(),
            lastused: newLastUsedDate.current.value,
            lastevent: newLastUsedEvent.current.value.trim()
        }

        var object = {
            questions: [newq]
        }

        try {
            const responseAdd = await fetch("https://qzblapi.azurewebsites.net/api/AddQuestions?uid=" + cookies.auth.uid + "&questions=" + encodeURIComponent(JSON.stringify(object)));
            if (!responseAdd.ok) {
                throw new Error("Failed to add new question.");
            } else {
                const responseRemove = await fetch("https://qzblapi.azurewebsites.net/api/RemoveQuestions?uid=" + cookies.auth.uid + "&ids=" + encodeURIComponent(JSON.stringify(randomQuestions.map((question) => question.id))));
                if (!responseRemove.ok) {
                    throw new Error("Failed to remove old questions.");
                } else {
                    console.log("Successfully removed duplicates and added new question.");
                    fetchQuestions();
                }
            }
        } catch (e) {
            console.log("Error: " + e)
            document.getElementById("duplicate-loading").style.display = "none";
            document.getElementById("fetch-duplicates").removeAttribute("disabled");
        }
    }

    async function fetchQuestions() {
        try {
            document.getElementById("duplicate-loading").style.display = "flex";
            document.getElementById("fetch-duplicates").setAttribute("disabled", "true");
            const response = await fetch("https://qzblapi.azurewebsites.net/api/DuplicateDetect?uid=" + cookies.auth.uid);
            if (!response.ok) {
                throw new Error("Failed to fetch filters");
            }
            const data = await response.json();

            if (data.endingQuestions.length > 0) {
                for (var i = 0; i < data.endingQuestions.length; i++) {
                    if (data.endingQuestions[i].Topic == null) {
                      data.endingQuestions[i].Topic = "N/A";
                    }
                    if (data.endingQuestions[i].Resource == null) {
                      data.endingQuestions[i].Resource = "N/A";
                    }
                    if (data.endingQuestions[i].Species == null) {
                      data.endingQuestions[i].Species = "N/A";
                    }
                    if (data.endingQuestions[i].Level == null) {
                      data.endingQuestions[i].Level = "N/A";
                    }
          
                    if (data.endingQuestions[i].lastusagedate == null) {
                      data.endingQuestions[i].lastusagedate = "N/A";
                    } else {
                      data.endingQuestions[i].lastusagedate = new Date(
                        data.endingQuestions[i].lastusagedate
                      ).toLocaleDateString();
                    }
          
                    if (data.endingQuestions[i].lastusageevent == null) {
                      data.endingQuestions[i].lastusageevent = "N/A";
                    }
                  }
          
                  setRandomQuestions(data.endingQuestions)

                  document.getElementById("duplicate-loading").style.display = "none";

                  setTimeout(() => { autocomplete(data.endingQuestions); document.getElementById("fetch-duplicates").removeAttribute("disabled"); }, 500);

            } else {    
                console.log("No questions found.");
                document.getElementById("duplicate-loading").style.display = "none";
                document.getElementById("fetch-duplicates").removeAttribute("disabled");
            }
        } catch (e) {
            console.log("Error: " + e)
            document.getElementById("duplicate-loading").style.display = "none";
            document.getElementById("fetch-duplicates").removeAttribute("disabled");
        }
    }

    function autocomplete(questions) {
        console.log("Attempting to auto-fill fields.");

        var question = "";
        var answer = "";

        var level = "";
        var topic = "";
        var species = "";
        var resource = "";
        var lastuseddate  = "";
        var lastusageevent = "";

        for (var i = 0; i < questions.length; i++) {
            if (questions[i].Question != "N/A" && questions[i].Question != "") {
                if (question != questions[i].Question && question != "") {
                    question = "-"
                } else {
                    question = questions[i].Question;
                }
            }

            if (questions[i].Answer != "N/A" && questions[i].Answer != "") {
                if (answer != questions[i].Answer && answer != "") {
                    answer = "-"
                } else {
                    answer = questions[i].Answer;
                }
            }

            if (questions[i].Level != "N/A" && questions[i].Level != "") {
                if (!questions[i].Level.includes(level) && level != "") {
                    level = "-"
                } else {
                    level = questions[i].Level;
                }
            }

            if (questions[i].Topic != "N/A" && questions[i].Topic != "") {
                if (!questions[i].Topic.includes(topic) && topic != "") {
                    topic = "-"
                } else {
                    topic = questions[i].Topic;
                }
            }

            if (questions[i].Species != "N/A" && questions[i].Species != "") {
                if (!questions[i].Species.includes(species) && species != "") {
                    species = "-"
                } else {
                    species = questions[i].Species;
                }
            }

            if (questions[i].Resource != "N/A" && questions[i].Resource != "") {
                if (!questions[i].Resource.includes(resource) && resource != "") {
                    resource = "-"
                } else {
                    resource = questions[i].Resource;
                }
            }

            if (questions[i].lastusagedate != "N/A" && questions[i].lastusagedate != "") {
                if (lastuseddate != questions[i].lastusagedate && lastuseddate != "") {
                    lastuseddate = "-"
                } else {
                    lastuseddate = questions[i].lastusagedate;
                }
            }

            if (questions[i].lastusageevent != "N/A" && questions[i].lastusageevent != "") {
                if (lastusageevent != questions[i].lastusageevent && lastusageevent != "") {
                    lastusageevent = "-"
                } else {
                    lastusageevent = questions[i].lastusageevent;
                }
            }
        }

        if (question == "-") {
            question = "";
        }

        if (answer == "-") {
            answer = "";
        }

        if (level == "-") {
            level = "";
        }

        if (topic == "-") {
            topic = "";
        }

        if (species == "-") {
            species = "";
        }
        
        if (resource == "-") {
            resource = "";
        }

        if (lastuseddate == "-") {
            lastuseddate = "";
        }

        if (lastusageevent == "-") {
            lastusageevent = "";
        }

        try {
            newQuestion.current.value = question;
            newAnswer.current.value = answer;

            newLevel.current.value = level;
            newTopic.current.value = topic;
            newSpecies.current.value = species;
            newResource.current.value = resource;
            newLastUsedDate.current.value = lastuseddate;
            newLastUsedEvent.current.value = lastusageevent;
        } catch (e) {
            console.log("Error: " + e);
        }
    }
    
    function QuestionDisplay({}) {
        return (
            <div>
                {randomQuestions.map((question, index) => (
                <div
                    key={index}
                    className="question-card"
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
                    <div className="question-info-holder">
                        <p>
                        Resource: {question.Resource} | ID: {question.id}
                        <br />
                        Last Used: {question.lastusagedate} | Last Event Used At:{" "}
                        {question.lastusageevent}
                        </p>
                    </div>
                </div>
                ))}
            </div>
        )
    }

    function FlagDuplicates({ user }) {
        if (user != undefined && user.uid > 0) {
            return (
            <div className="midbound">
                <h1>Flag Duplicate Questions</h1>
                <p>
                As part of the move to this new database system, some questions ended up duplicated or were found to be stored multiple times in different database files. Since automated detection and merging of these files is difficult, you can help by identifying duplicates and tagging them with the correct information.<br />
                You can leave this page at any time. Your changes are saved every time you click the Submit Changes button.
                </p>
                {randomQuestions.length > 0 ? (
                    <div>
                        <h4>A potential set of duplicates is shown below:</h4>

                        <QuestionDisplay />

                        <h4>Fill in the fields below with the correct information.</h4>
                        <p>We guessed some of the tags based off of the information the duplicate questions contained. However, our guess may not be correct. <strong>Always check the autofilled values!</strong><br />
                        You can also fill new values here if you wish (for example, if no duplicate question had a topic, you can still specify one in the fields below).</p>

                        <div className="question-card" >
                            <div className="col-1">
                                <label>Question - Answer</label><br />
                                <textarea type="text" maxLength="256" id="new-question" className="textarea-input" placeholder="Question" ref={newQuestion}/>
                                <textarea type="text" maxLength="156" id="new-answer" className="textarea-input" placeholder="Answer" ref={newAnswer}/>
                            </div>
                            <div className="col-2">
                                <label>Level - Species - Topic</label><br />
                                <input type="text" id="new_level" className="select-box" placeholder="Level" ref={newLevel}/>
                                <input type="text" id="new-species" className="select-box" placeholder="Species"  ref={newSpecies}/>
                                <input type="text" id="new-topic" className="select-box" placeholder="Topic" ref={newTopic}/>
                            </div>
                            <div className="question-info-holder">
                                <label>Resource - Last Usage Date - Last Usage Event</label><br />
                                <textarea type="text" maxLength="256" id="new-resource" className="textarea-input" placeholder="Resource" ref={newResource}/>
                                <input type="date" id="new-last-used-date" className="select-box" ref={newLastUsedDate}/>
                                <input type="text" id="new-last-used-event" className="select-box" placeholder="Last Event Used At" ref={newLastUsedEvent}/>
                            </div>
                        </div>

                        <p>Clicking "Submit Changes" will remove all questions shown on this page from the database, create a new question with the specified information above, and fetch another set of duplicates to identify.</p>
                        <button id="fetch-duplicates" onClick={() => { removeDuplicates() }}>
                            Submit Changes
                        </button>
                        <img src="loading.gif" className="loading-symbol" id="duplicate-loading"/>
                    </div>
                ): (
                    <div>
                        <h3>How do I do this?</h3>
                        <p>
                            You'll be shown a set of potential duplicate questions below. Please use the bottom-most question information form to fill in the correct information. Once finished, click the "Submit" button to save your changes. The system will automatically remove the duplicate questions and create a new question in its place with the updated data.
                        </p>
                        <button id="fetch-duplicates" onClick={() => { fetchQuestions() }}>
                            Get Started
                        </button>
                        <img src="loading.gif" className="loading-symbol" id="duplicate-loading"/>
                    </div>
                )}
            </div>
            );
        } else {
            return (
            <div className="midbound">
                <h4>You're not logged in.</h4>
                <p>Please log in to view questions and use the Quizpedia software.</p>
                <button
                id="login-button"
                onClick={() => {
                    window.location.href = "/login";
                }}
                >
                Login
                </button>
            </div>
            );
        }
    }

    return (
        <FlagDuplicates user={cookies.auth}/>
    );
  }
  
  