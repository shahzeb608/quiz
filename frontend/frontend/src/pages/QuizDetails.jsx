import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/quiz-details.css";  

const QuizDetails = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/quizzes/${quizId}`,
          { withCredentials: true }
        );
        setQuiz(response.data.data);
      } catch (err) {
        setError("Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  const handleAttemptQuiz = () => {
    if (user) {
      navigate(`/quiz/${quizId}/attempt`);
    } else {
      navigate("/login", { state: { from: `/quiz/${quizId}/attempt` } });
    }
  };

  if (loading) return <div className="loading">Loading quiz details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quiz) return <div className="loading">Quiz not found</div>;

  return (
    <div className="quiz-details-container">
      <div className="quiz-card">
        <h1 className="quiz-title">{quiz.title}</h1>
        <p className="quiz-description">{quiz.description}</p>
        
        <div className="quiz-info">
          <h3>Quiz Details:</h3>
          <ul>
            <li>Number of Questions: {quiz.questions.length}</li>
            <li>Duration: {quiz.duration} minutes</li>
          </ul>
        </div>

        <button onClick={handleAttemptQuiz} className="start-quiz-btn">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizDetails;
