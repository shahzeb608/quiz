import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../features/quizzes/quizzesSlice';

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Available Quizzes</h1>
      
      {status === 'loading' ? (
        <div className="text-center">Loading quizzes...</div>
      ) : (
        <div className="grid gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => handleQuizClick(quiz._id)}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <div className="flex justify-between text-gray-600">
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