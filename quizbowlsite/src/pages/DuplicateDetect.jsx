import React from 'react';
import { useCookies } from "react-cookie";

export function DuplicateDetect() { 
    const [randomQuestions, setRandomQuestions] = React.useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    async function fetchQuestions() {
        try {
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
            } else {    
                console.log("No questions found.");
            }
        } catch (e) {
            console.log("Error replacing question: " + e)
        }
    }
    
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
                <div className="question-info-holder">
                    <p>
                    Resource: {question.Resource} | ID: {question.id}
                    <br />
                    Last Used: {question.lastusagedate} | Last Event Used At:{" "}
                    {question.lastusageevent}
                    </p>
                    <img src="loading.gif" alt="Loading..." id="q-operation-loading" className="loading-symbol" />
                    <div>
                    {/* Edit button */}
                    <button className="action-buttons" onClick={() => { handleEditClick() }} title="Edit this question. Changes are saved to the database.">Edit</button>
                    {/* Remove button */}
                    {(randomQuestions.length < 12) ? (
                        <button className="action-buttons" disabled={true} title="This button is disabled because there are no other questions in the database to replace this question with.">Replace</button>
                    ): (
                        <button className="action-buttons" onClick={() => { handleReplaceClick(question.id) }} title="Replace this question with a new randomly picked one.">Replace</button>
                    )}
                    {/* Delete button */}
                    <button className="buttons-dark" onClick={() => { handleDeleteClick(question.id) }} title="Delete this question from the database and replace it with a new randomly picked one.">Delete</button>
                    </div>
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
                <h3>How do I do this?</h3>
                <p>
                    You'll be shown a set of potential duplicate questions below. Please use the bottom-most question information form to fill in the correct information. Once finished, click the "Submit" button to save your changes. The system will automatically remove the duplicate questions and create a new question in its place with the updated data.
                </p>
                <button onClick={() => { fetchQuestions() }}>
                    Fetch Duplicate Questions
                </button>
                <QuestionDisplay />
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
        <FlagDuplicates user={cookies.auth} />
    );
  }
  
  