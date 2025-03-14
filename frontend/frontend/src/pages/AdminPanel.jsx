import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", ""], correctAnswer: "" }]);
  const [editingQuiz, setEditingQuiz] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetchUsers();
    fetchQuizzes();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unauthorized");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/quizzes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setQuizzes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching quizzes");
    }
  };

  
  const toggleUserBan = async (userId, isBanned) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${userId}/ban`,
        { banned: !isBanned },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      fetchUsers();
    } catch (error) {
      setError("Failed to update user status.");
    }
  };

  
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
    }
  };

  
  const saveQuiz = async () => {
    if (!quizTitle || !duration || questions.length === 0) {
      setError("Please fill all fields.");
      return;
    }

    for (const q of questions) {
      if (!q.questionText || q.options.length < 2 || !q.correctAnswer) {
        setError("Each question must have text, at least two options, and a correct answer.");
        return;
      }
    }

    try {
      if (editingQuiz) {
        
        await axios.put(
          `http://localhost:8000/api/admin/quizzes/${editingQuiz._id}`,
          { title: quizTitle, questions, duration },
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );
      } else {
        
        await axios.post(
          "http://localhost:8000/api/admin/quizzes",
          { title: quizTitle, questions, duration },
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );
      }

      fetchQuizzes();
      resetForm();
    } catch (error) {
      setError("Failed to save quiz.");
    }
  };

  
  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      setError("Failed to delete quiz.");
    }
  };

  
  const editQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizTitle(quiz.title);
    setDuration(quiz.duration);
    setQuestions(quiz.questions);
  };

  
  const resetForm = () => {
    setEditingQuiz(null);
    setQuizTitle("");
    setDuration("");
    setQuestions([{ questionText: "", options: ["", ""], correctAnswer: "" }]);
  };

  return (
    <div>
      <h1>Admin Panel - User & Quiz Management</h1>

      
      <h2>Users</h2>
      {users.length === 0 ? <p>No users available.</p> : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.email} - {user.banned ? "Banned" : "Active"}
              <button onClick={() => toggleUserBan(user._id, user.banned)}>
                {user.banned ? "Unban" : "Ban"}
              </button>
              <button onClick={() => deleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      
      <h2>{editingQuiz ? "Edit Quiz" : "Create Quiz"}</h2>
      <input type="text" placeholder="Quiz Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
      <input type="number" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-4">
          <input type="text" placeholder={`Question ${qIndex + 1}`} value={question.questionText} onChange={(e) => {
            const newQuestions = [...questions];
            newQuestions[qIndex].questionText = e.target.value;
            setQuestions(newQuestions);
          }} />

          {question.options.map((option, optIndex) => (
            <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} value={option} onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[qIndex].options[optIndex] = e.target.value;
              setQuestions(newQuestions);
            }} />
          ))}

          <input type="text" placeholder="Correct Answer" value={question.correctAnswer} onChange={(e) => {
            const newQuestions = [...questions];
            newQuestions[qIndex].correctAnswer = e.target.value;
            setQuestions(newQuestions);
          }} />
        </div>
      ))}

      <button onClick={saveQuiz}>{editingQuiz ? "Update Quiz" : "Create Quiz"}</button>
      <button onClick={resetForm} disabled={!editingQuiz}>Cancel Edit</button>

      <h2>Existing Quizzes</h2>
      {quizzes.length === 0 ? <p>No quizzes available.</p> : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              {quiz.title} - {quiz.duration} min
              <button onClick={() => editQuiz(quiz)}>Edit</button>
              <button onClick={() => deleteQuiz(quiz._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AdminPanel;
