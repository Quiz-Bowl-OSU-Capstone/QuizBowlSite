
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export function MissingInfo() {
  const [cookies, setCookie, removeCookie] = useCookies(); 
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [currentQuestion, setCurrentQuestion] = useState({}); 

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    const uid = cookies && cookies.auth && cookies.auth.uid ? cookies.auth.uid : '';

    const apiUrl = `https://qzblapi.azurewebsites.net/api/MissingData?uid=${uid}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setQuestions(data.questions || []);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  const handleSaveClick = () => {
    const uid = cookies && cookies.auth && cookies.auth.uid ? cookies.auth.uid : '';
    const questionsData = {
      questions: [currentQuestion]
    };

    const apiUrl = `https://<functionappname>.azurewebsites.net/api/EditQuestions?uid=${uid}&questions=${encodeURIComponent(JSON.stringify(questionsData))}`;

    fetch(apiUrl, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Questions edited:", data.questionsEdited);
        // Update the questions state with the saved question
        const updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = currentQuestion;
        setQuestions(updatedQuestions);
        setEditingIndex(null);
        setCurrentQuestion({});
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setCurrentQuestion({ ...questions[index] });
  };

  const handleInputChange = (event, field) => {
    setCurrentQuestion({ ...currentQuestion, [field]: event.target.value });
  };

  return (
    <div className="card">
      <h2>List of questions with missing data</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <div>
                <strong>Question:</strong> {question.Question}<br />
                {Object.keys(question).filter(key => !question[key]).map(field => (
                  <div key={field}>
                    <label>{field}:</label>
                    <input
                      type="text"
                      value={currentQuestion[field] || ''}
                      onChange={(e) => handleInputChange(e, field)}
                    />
                  </div>
                ))}
                <button onClick={handleSaveClick}>Save</button>
              </div>
            ) : (
              <div>
                <strong>Question:</strong> {question.Question}<br />
                <strong>Missing Fields:</strong> {Object.keys(question).filter(key => !question[key]).join(', ')}<br />
                <button onClick={() => handleEditClick(index)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
