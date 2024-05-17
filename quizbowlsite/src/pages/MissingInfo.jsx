

import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export function MissingInfo() {
  const [cookies] = useCookies(); 
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [showPopup, setShowPopup] = useState(false);

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
        const updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = currentQuestion;
        setQuestions(updatedQuestions);
        setEditingIndex(null);
        setCurrentQuestion({});
        setShowPopup(false); // Close the pop-up after saving
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setCurrentQuestion({ ...questions[index] });
    setShowPopup(true);
  };

  const handleInputChange = (event, field) => {
    setCurrentQuestion({ ...currentQuestion, [field]: event.target.value });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', background: '#fff' }}>
      <h2>List of questions with missing data</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <div>
              <strong>Question:</strong> {question.Question}<br />
              <button onClick={() => handleEditClick(index)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: '1000'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={handleClosePopup} style={{ alignSelf: 'flex-end', cursor: 'pointer', background: 'none', border: 'none', fontSize: '20px' }}>X</button>
            {Object.keys(currentQuestion).map(field => (
              <div key={field} style={{ marginBottom: '10px' }}>
                <label>{field}:</label>
                <input
                  type="text"
                  value={currentQuestion[field] || ''}
                  onChange={(e) => handleInputChange(e, field)}
                  style={{ marginLeft: '10px' }}
                />
              </div>
            ))}
            <button onClick={handleSaveClick}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
