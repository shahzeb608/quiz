import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

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
    if (!user) {
      navigate("/login", { state: { from: `/quiz/${quizId}/attempt` } });
    } else {
      navigate(`/quiz/${quizId}/attempt`);
    }
  };

  if (loading) return <div className="text-center py-8">Loading quiz details...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!quiz) return <div className="text-center py-8">Quiz not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.description}</p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Quiz Details:</h3>
          <ul className="list-disc pl-6">
            <li>Number of Questions: {quiz.questions.length}</li>
            <li>Duration: {quiz.duration} minutes</li>
          </ul>
        </div>

        <button
          onClick={handleAttemptQuiz}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizDetails;