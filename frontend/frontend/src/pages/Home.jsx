import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicQuizzes } from '../features/quizzes/quizzesSlice'; // Use fetchPublicQuizzes for the home page
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quizzes = useSelector((state) => state.quizzes.publicQuizzes || []); 
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPublicQuizzes()); 
  }, [dispatch]);

  const handleQuizClick = (quizId) => {
    if (user) {
      navigate(`/quiz/${quizId}/details`); 
    } else {
      navigate('/login', { state: { from: `/quiz/${quizId}/details` } }); 
    }
  };
  
  return (
    <div>
      <h1>All Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes available</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id} onClick={() => handleQuizClick(quiz._id)}>
              {quiz.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;