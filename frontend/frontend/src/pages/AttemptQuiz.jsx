import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/attempt-quiz.css"; 

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/quizzes/${quizId}`,
          { withCredentials: true }
        );
        setQuiz(response.data.data);
        setTimeLeft(response.data.data.duration * 60);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        
        if (err.response?.status === 401) {
          navigate("/login", { state: { from: `/quiz/${quizId}/attempt` } });
        } else {
          setError("Failed to load quiz: " + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuiz();
    } else {
      navigate("/login", { state: { from: `/quiz/${quizId}/attempt` } });
    }
  }, [quizId, user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/quizzes/${quizId}/submit`,
        { answers },
        { withCredentials: true }
      );
      setScore(response.data.data.score);
    } catch (error) {
      setError("Failed to submit quiz");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="attempt-quiz-container">
      <div className="quiz-header">
        <h1>{quiz?.title}</h1>
        <div className="timer">Time Remaining: {formatTime(timeLeft)}</div>
      </div>

      {quiz?.questions.map((question, index) => (
        <div key={question._id} className="question-card">
          <h3 className="question-text">Question {index + 1}: {question.questionText}</h3>
          
          <div className="options">
            {question.options.map((option, optIndex) => (
              <label key={optIndex} className="option-label">
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() => handleSelectAnswer(question._id, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSubmitQuiz} className="submit-btn">
        Submit Quiz
      </button>

      {score !== null && <div className="score-container">Your Score: {score}/{quiz?.questions.length}</div>}
    </div>
  );
};

export default AttemptQuiz;
