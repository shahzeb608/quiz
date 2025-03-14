import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes } from "../features/quizzes/quizzesSlice";
import "../styles/home.css"; 

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: quizzes, status } = useSelector((state) => state.quizzes);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Available Quizzes</h1>

      {status === "loading" ? (
        <div className="loading">Loading quizzes...</div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => handleQuizClick(quiz._id)}
              className="quiz-card"
            >
              <h2 className="quiz-title">{quiz.title}</h2>
              <div className="quiz-info">
                <span>{quiz.questions.length} questions</span>
                <span>{quiz.duration} minutes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
