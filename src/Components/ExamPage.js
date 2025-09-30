import React, { useState, useEffect } from 'react';
import './ExamPage.css';
import Header from './Header';
import Footer from './Footer';

const examOptions = [
  { name: 'FMGE', country: 'India' },
  { name: 'NEET UG', country: 'India' },
  { name: 'NEET PG', country: 'India' },
  { name: 'USMLE', country: 'United States' },
  { name: 'PLAB', country: 'United Kingdom' },
  { name: 'MRCP', country: 'United Kingdom' },
  { name: 'MCCQE', country: 'Canada' },
  { name: 'AMC Exam', country: 'Australia' },
  { name: 'Approbation Exam', country: 'Germany' },
  { name: 'ECN', country: 'France' },
  { name: 'National Examination for Medical Practitioners', country: 'Japan' },
  { name: 'KMLE', country: 'South Korea' }
];

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

const ExamPage = () => {
  const [exam, setExam] = useState('');
  const [topics, setTopics] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTags, setFormTags] = useState('');

  const handleGenerateQuiz = async () => {
    setLoading(true);
    console.log('Generating quiz with:', { exam, topics: topics.split(','), numQuestions });

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exam, topics: topics.split(','), num_questions: numQuestions, difficulty }),
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (data.success) {
        setQuiz(data.exam);
        setSubmitted(false);
        setResults(null);
      } else {
        console.error('Failed to generate quiz:', data.error);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, answer) => {
    setAnswers({ ...answers, [index]: answer });
  };

  const handleSubmit = () => {
    let correctAnswers = 0;

    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correctAnswers++;
      }
    });

    setResults({ correct: correctAnswers, total: quiz.length });
    setSubmitted(true);
  };

  useEffect(() => {
    const handleLoginWithStoredCredentials = async () => {
      try {
        const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
        const storedSubscriptionStatus = localStorage.getItem('isSubscribed');

        if (storedSubscriptionStatus) {
          setIsSubscribed(JSON.parse(storedSubscriptionStatus));
        }
        if (!storedCredentials) {
          throw new Error('No stored credentials found');
        }
        const { email, password } = JSON.parse(storedCredentials);

        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('Logged in successfully:', loginData);
          setIsLoggedIn(true);
          setUserEmail(email);
        } else {
          throw new Error('Failed to login with stored credentials');
        }
      } catch (error) {
        console.error('Error logging in with stored credentials:', error);
      }
    };
    handleLoginWithStoredCredentials();
  }, []);

  const handleSaveClick = (question) => {
    setCurrentQuestion(question);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setFormTitle('');
    setFormTags('');
  };

  const handleFormSubmit = async () => {
    const currentQuizQuestion = quiz.find((q) => q.question === currentQuestion);
    const correctAnswer = currentQuizQuestion.answer;
  
    const saveData = {
      text: `${currentQuestion} (Correct Answer: ${correctAnswer})`,
      title: formTitle,
      tags: formTags.split(',').map(tag => tag.trim()),
      type: 'question',
      email: userEmail,
    };
  
    console.log(saveData);
  
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });
  
      const data = await response.json();
      if (data.message === 'Saved successfully') {
        alert('Question saved successfully');
        handlePopupClose();
      } else {
        alert('Failed to save question');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question');
    }
  };
  

  return (
    <div className="ExamPage-container">
      <Header />
      <div className="ExamPage-main">
        <h1>Generate <span>Quiz</span></h1>
        {isLoggedIn && isSubscribed ? (
          <div className="ExamPage-form">
            <label>
              Exam Name:
              <select value={exam} onChange={(e) => setExam(e.target.value)}>
                <option value="" disabled>Select an exam</option>
                {examOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name} - {option.country}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Topics (comma separated):
              <input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} />
            </label>
            <label>
              Number of Questions:
              <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
            </label>
            {/* Difficulty dropdown */}
            <label>
              Difficulty:
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {difficultyLevels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
            <div className="ExamPage-button-container">
              <button onClick={handleGenerateQuiz} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          </div>
        ) : (
          <p>Please login and subscribe to generate quiz.</p>
        )}

        {quiz.length > 0 && (
          <div className="ExamPage-quiz">
            <h2>Quiz</h2>
            {quiz.map((q, index) => (
              <div key={index} className="ExamPage-question">
                <p>{q.question}</p>
                {q.options.map((option, i) => (
                  <label key={i} className="ExamPage-option">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerChange(index, option)}
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
                {submitted && (
                  <p className={`ExamPage-correct-answer ${answers[index] === q.answer ? 'correct' : 'incorrect'}`}>
                    {answers[index] === q.answer ? 'Correct!' : `Correct Answer: ${q.answer}`}
                  </p>
                )}
                <button className='ExamPage-save' style={{background: 'transparent', color: '#555'}} onClick={() => handleSaveClick(q.question)}>Save</button>
              </div>
            ))}
            {!submitted && <button onClick={handleSubmit}>Submit</button>}
          </div>
        )}

        {submitted && results && (
          <div className="ExamPage-results">
            <h2>Results</h2>
            <p>
              You got {results.correct} out of {results.total} questions correct.
            </p>
          </div>
        )}
      </div>
      <Footer />

      {showPopup && (
        <div className="ExamPage-popup">
          <div className="ExamPage-popup-content">
            <h2>Save Question</h2>
            <label>
              Title:
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            </label>
            <label>
              Tags (comma separated):
              <input type="text" value={formTags} onChange={(e) => setFormTags(e.target.value)} />
            </label>
            <div className="ExamPage-popup-buttons">
              <button onClick={handleFormSubmit}>Save</button>
              <button onClick={handlePopupClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
