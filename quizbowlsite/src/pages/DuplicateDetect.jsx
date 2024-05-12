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

    async function fetchQuestions() {
        try {
            document.getElementById("duplicate-loading").style.display = "flex";
            document.getElementById("fetch-duplicates").setAttribute("disabled", "true");
            const response = await fetch("https://qzblapi.azurewebsites.net/api/DuplicateDetect?uid=" + cookies.auth.uid);
            if (!response.ok) {
                throw new Error("Failed to fetch filters");
            }
            const data = await response.json();
            console.log(data.endingQuestions[0]);

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
          
                  setRandomQuestions(data.endingQuestions);
                  document.getElementById("duplicate-loading").style.display = "none";
                  document.getElementById("fetch-duplicates").removeAttribute("disabled");
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

    function autocomplete() {
        console.log("Attempting to auto-fill fields.");
        newQuestion.current.value = "test";
        newAnswer.current.value = "test";
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
                As part of the move to this new database system, some questions ended up duplicated or were found to be stored multiple times in different database files. Since automated detection and merging of these files is difficult, you can help by identifying duplicates and tagging them with the correct information.
                </p>
                {randomQuestions.length > 0 ? (
                    <div>
                        <h4>A potential set of duplicates is shown below:</h4>

                        <QuestionDisplay />

                        <h4>Fill in the fields below to create a new question that will replace the ones shown above.</h4>
                        <p>Some information was automatically estimated and filled. You can change this if it is incorrect.</p>

                        <div className="question-card" >
                            <div className="col-1">
                                <input type="text" id="new-question" className="select-box" placeholder="Question" ref={newQuestion}/>
                                <input type="text" id="new-answer" className="select-box" placeholder="Answer" ref={newAnswer}/>
                            </div>
                            <div className="col-2">
                                <input type="text" id="new_level" className="select-box" placeholder="Level" ref={newLevel}/>
                                <input type="text" id="new-species" className="select-box" placeholder="Species"  ref={newSpecies}/>
                                <input type="text" id="new-topic" className="select-box" placeholder="Topic" ref={newTopic}/>
                            </div>
                            <div className="question-info-holder">
                                <input type="text" id="new-resource" className="select-box" placeholder="Resource" ref={newResource}/>
                                <input type="date" id="new-last-used-date" className="select-box" ref={newLastUsedDate}/>
                                <input type="text" id="new-last-used-event" className="select-box" placeholder="Last Event Used At" ref={newLastUsedEvent}/>
                            </div>
                        </div>

                        <button id="fetch-duplicates" onClick={() => { fetchQuestions() }}>
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
                            Fetch Duplicate Questions
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
  
  