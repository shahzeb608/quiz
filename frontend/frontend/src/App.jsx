import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import Home from './pages/Home';
import QuizDetails from './pages/QuizDetails';
import AttemptQuiz from './pages/AttemptQuiz';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/leaderboard" element={<Leaderboard />} />
  <Route path="/quiz/:quizId" element={<QuizDetails />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/admin-login" element={<AdminLogin />} />
  
    
    <Route path="/quiz/:quizId/details" element={<QuizDetails />} />
        
        
       
  <Route element={<PrivateRoute />}>
    <Route path="/quiz/:quizId/attempt" element={<AttemptQuiz />} />
  </Route>

  
  <Route element={<PrivateRoute adminOnly={true} />}>
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
</Routes>
      </main>
    </Router>
  );
};

export default App;