import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export function Edit() {
    const newQuestion = React.useRef(null);
    const newAnswer = React.useRef(null);
    const newLevel = React.useRef(null);
    const newSpecies = React.useRef(null);
    const newTopic = React.useRef(null);
    const newResource = React.useRef(null);
    const newLastUsedDate = React.useRef(null);
    const newLastUsedEvent = React.useRef(null);

    const [id, setID] = React.useState(null);

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        var question = params.get('question');

        if (question != null && question != "" && cookies.auth != null && cookies.auth.uid > 0 && cookies.auth.admin) {
            console.log("Provided question!");
            try {
                question = JSON.parse(decodeURIComponent(question));

                console.log(question);
                newQuestion.current.value = question.Question;
                newAnswer.current.value = question.Answer;

                if (question.Level != "N/A") {
                    newLevel.current.value = question.Level;
                }

                if (question.Species != "N/A") {
                    newSpecies.current.value = question.Species;
                }

                if (question.Topic != "N/A") {
                    newTopic.current.value = question.Topic;
                }

                if (question.Resource != "N/A") {
                    newResource.current.value = question.Resource;
                }

                if (question.lastusageevent != "N/A") {
                    newLastUsedEvent.current.value = question.lastusageevent;
                }

                if (question.lastusagedate != null && question.lastusagedate != "" && question.lastusagedate != "N/A") {
                    newLastUsedDate.current.value = question.lastusedate.split("T")[0];
                }

                setID(question.ID);
            } catch (e) {
                console.log("Error: " + e);
                window.alert("An error occurred parsing data. To preserve data integrity, you will be redirected to the main page. No edits were made. Please try again and make sure to use the official Quizpedia website!");
                window.location.href="/";
            }
        } else {
            console.log("No question provided!");
            window.location.href="/";
        }
    }, []);

    async function handleEdit() {
        var nquestion = newQuestion.current.value;
        var nanswer = newAnswer.current.value;
        var nlevel = newLevel.current.value;
        var nspecies = newSpecies.current.value;
        var ntopic = newTopic.current.value;
        var nresource = newResource.current.value;
        var nlastusedate = newLastUsedDate.current.value;
        var nlastusageevent = newLastUsedEvent.current.value;

        if (nquestion == "" || nanswer == "" || nlevel == "" || nspecies == "" || ntopic == "" || nresource == "") {
            if (!confirm("You haven't filled out all fields. Are you sure you want to continue?")) {
                console.log("User cancelled edit.");
                return;
            };
        }
        console.log("Editing question...");

        document.getElementById("edit-question-submit").setAttribute("disabled", "true");
        document.getElementById("edit-loading").style.display = "block";

        var questions = {
            questions: [
                {
                    question: nquestion,
                    answer: nanswer,
                    level: nlevel,
                    species: nspecies,
                    topic: ntopic,
                    resource: nresource,
                    id: id
                }
            ]
        }

        var queryString = "https://qzblapi.azurewebsites.net/api/EditQuestions?uid=" + cookies.auth.uid + "&questions=" + encodeURIComponent(JSON.stringify(questions));
        const response = await fetch("https://qzblapi.azurewebsites.net/api/EditQuestions?uid=" + cookies.auth.uid + "&questions=" + encodeURIComponent(JSON.stringify(questions)));
        const data = await response.json();
        console.log(data);
    }

    return (
        <div className="midbound">
            <h3>Edit Question</h3>
            <p>Make your edits to the question here, then click Submit once you're ready. Changes will be saved to the database.</p>
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
            <button id="edit-question-submit" onClick={() => { handleEdit() }}>
                Submit Changes
            </button>
            <img src="loading.gif" className="loading-symbol" id="edit-loading"/>
        </div>
    )
}