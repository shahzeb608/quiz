import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../features/leaderboard/leaderboardSlice";
import "../styles/leaderboard.css";  

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { entries, status, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      
      {status === 'loading' && <p className="loading">Loading leaderboard...</p>}
      {error && <p className="error">{error}</p>}

      {status === 'succeeded' && (
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry._id}>
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.quizId?.title || 'Unknown Quiz'}</td>
                  <td>{entry.score}</td>
                  <td>{new Date(entry.attemptedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
