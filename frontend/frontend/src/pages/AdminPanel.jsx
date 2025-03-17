import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/users/usersSlice";
import { fetchQuizzes } from "../features/quizzes/quizzesSlice";
import axios from "axios";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { list: users, status: usersStatus } = useSelector((state) => state.users);
  const { quizzes, status: quizzesStatus } = useSelector((state) => state.quizzes);
  const [activeTab, setActiveTab] = useState("users");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/admin/dashboard", {
          withCredentials: true
        });
        setDashboardStats(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Fetch users and quizzes
  useEffect(() => {
    console.log("Dispatching fetchUsers and fetchQuizzes");
    dispatch(fetchUsers());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  // Debug logs
  useEffect(() => {
    console.log("Users in state:", users);
    console.log("Quizzes in state:", quizzes);
  }, [users, quizzes]);

  const handleBanUser = async (userId) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/users/${userId}/ban`, {}, {
        withCredentials: true
      });
      dispatch(fetchUsers()); // Refresh user list
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/users/${userId}/unban`, {}, {
        withCredentials: true
      });
      dispatch(fetchUsers()); // Refresh user list
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/quizzes/${quizId}`, {
        withCredentials: true
      });
      dispatch(fetchQuizzes()); // Refresh quiz list
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  if (loading && !dashboardStats) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>

      {dashboardStats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{dashboardStats.totalUsers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Quizzes</h3>
            <p>{dashboardStats.totalQuizzes || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Quiz Attempts</h3>
            <p>{dashboardStats.totalAttempts || 0}</p>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "quizzes" ? "active" : ""}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </button>
      </div>

      {activeTab === "users" && (
        <div className="users-section">
          <h2>User Management</h2>
          {usersStatus === "loading" ? (
            <p>Loading users...</p>
          ) : users && users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.isBanned ? "Banned" : "Active"}</td>
                    <td>
                      {user.isBanned ? (
                        <button
                          className="unban-btn"
                          onClick={() => handleUnbanUser(user._id)}
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          className="ban-btn"
                          onClick={() => handleBanUser(user._id)}
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found. {JSON.stringify(users)}</p>
          )}
        </div>
      )}

      {activeTab === "quizzes" && (
        <div className="quizzes-section">
          <h2>Quiz Management</h2>
          {quizzesStatus === "loading" ? (
            <p>Loading quizzes...</p>
          ) : quizzes && quizzes.length > 0 ? (
            <table className="quizzes-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.category}</td>
                    <td>{quiz.questions?.length || 0}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => console.log("Edit quiz", quiz._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteQuiz(quiz._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No quizzes found. {JSON.stringify(quizzes)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;