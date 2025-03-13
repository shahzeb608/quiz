import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

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
          { 
            withCredentials: true,
            timeout: 10000 // Add timeout
          }
        );
        setQuiz(response.data.data);
      } catch (err) {
        if(err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load quiz");
        }
      } finally {
        setLoading(false);
      }
    };
  
    if (user) fetchQuiz()
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

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz?.title}</h1>
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      {quiz?.questions.map((question, index) => (
        <div key={question._id} className="mb-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Question {index + 1}: {question.questionText}
          </h3>
          
          <div className="grid gap-3">
            {question.options.map((option, optIndex) => (
              <label 
                key={optIndex}
                className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() => handleSelectAnswer(question._id, option)}
                  className="h-4 w-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmitQuiz}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Submit Quiz
      </button>

      {score !== null && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
          <h3 className="text-xl font-semibold">
            Your Score: {score}/{quiz?.questions.length}
          </h3>
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;