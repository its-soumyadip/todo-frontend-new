import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import PasswordReset from './components/PasswordReset';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import './static/main.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [message, setMessage] = useState('Please login to add and view your tasks!');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setMessage('');
    }
    setLoading(false);
  }, []);

  const handleTasksUpdated = () => {
    setTasksUpdated((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setMessage('You have been logged out. Please login to add and view your tasks!');
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    handleTasksUpdated();
    setUsername(username);
    localStorage.setItem('username', username);
    setMessage(`Make it happen, task by task. ${username}!`);
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="todo-app">
        {isLoggedIn && (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Logout <i className="fa-solid fa-right-from-bracket"></i>
            </button>

            <i className="fa-solid fa-right-from-bracket logout-backup" onClick={handleLogout}></i>
          </>
        )}

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  <h1 id="h1">What's your plan today {username}?</h1>
                  <TaskForm onTaskAdded={handleTasksUpdated} />
                  {message && <p className="message">{message}</p>}
                  <TaskList tasksUpdated={tasksUpdated} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              <>
                <br />
                <br />
                {message && <p className="message">{message}</p>}
                <LoginForm onLogin={handleLogin} />
              </>
            }
          />

          <Route path="/reset-password" element={<PasswordReset />} />

          <Route
            path="/reset-password/:uidb64/:token"
            element={<PasswordResetConfirm />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default AppWrapper;
