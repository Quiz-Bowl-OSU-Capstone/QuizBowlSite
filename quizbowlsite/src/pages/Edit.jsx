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
        var index = cookies.editQuestion.index;
        var question = localStorage.getItem("questions");

        if (question != null && question != "" && index != null && cookies.auth != null && cookies.auth.uid > 0 && cookies.auth.admin) {
            console.log("Provided question and index: " + index);
            question = JSON.parse(question)[index];
            try {
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
                    try {
                        var parsedDate = new Date(question.lastusagedate);
                        newLastUsedDate.current.value = parsedDate.toISOString().split('T')[0];
                    } catch (e) {
                        console.log("Error parsing last usage date: " + e);
                        console.log("This isn't really a big deal, just ignore");
                    }
                }

                setID(question.id);
            } catch (e) {
                console.log("Error: " + e);
                window.alert("An error occurred parsing data. To preserve data integrity, you will be redirected to the main page. No edits were made. Please try again and make sure to use the official Quizpedia website when editing!");
                //window.location.href="/";
            }
        } else {
            console.log("No question provided!");
            //window.location.href="/";
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
                    lastusagedate: nlastusedate,
                    lastusageevent: nlastusageevent,
                    id: id
                }
            ]
        }

        var queryString = "?uid=" + cookies.auth.uid + "&questions=" + encodeURIComponent(JSON.stringify(questions));
        console.log(queryString);
        const response = await fetch("https://qzblapi.azurewebsites.net/api/EditQuestions" + queryString);
        const data = await response.json();
        console.log(data);
        if (data.questionsEdited && data.questionsEdited > 0) {
            console.log("Successfully edited question!");

            var index = cookies.editQuestion.index;
            var question = localStorage.getItem("questions");
            if (question != null && question != "" && index != null && cookies.auth != null && cookies.auth.uid > 0 && cookies.auth.admin) {
                question = JSON.parse(question);

                question[index].Question = nquestion.trim();
                question[index].Answer = nanswer.trim();
                question[index].Level = nlevel.trim().toUpperCase();
                question[index].Species = nspecies.trim().toUpperCase();
                question[index].Topic = ntopic.trim().toUpperCase();
                question[index].Resource = nresource.trim();
                question[index].lastusagedate = nlastusedate;
                question[index].lastusageevent = nlastusageevent.trim();

                localStorage.setItem("questions", JSON.stringify(question));
            }
        } else {
            console.log("Error: " + data.Error);
            alert("An error occurred when trying to save your edit. No changes have been made.  Try again later.");
        }
        removeCookie("editQuestion");
        window.location.href = "/";
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
            <button id="back" onClick={() => {
                removeCookie("editQuestion");
                window.location.href = "/";
            }}>
                Back
            </button>
            <img src="loading.gif" className="loading-symbol" id="edit-loading"/>
        </div>
    )
}