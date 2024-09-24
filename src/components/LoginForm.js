import React, { useState, useRef, useEffect } from 'react';
import '../static/login.css'; // Ensure to link your CSS
import { login, register, passwordReset } from '../services/api';
import Loader from './Loader';
// import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
// import axios from 'axios';
import GoogleLogin from './GoogleLogin';

const LoginFormDialog = ({ onLogin }) => {
  const dialogRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedForm, setSelectedForm] = useState('login');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newfirstname, setNewFirstname] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openDialog = () => {
    if (!modalOpen) {
      const dialog = dialogRef.current;
      dialog.showModal();
      setModalOpen(true);
      document.body.classList.add('add_blur');
    }
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;
    if (dialog.open) {
      dialog.close();
      setModalOpen(false);
      document.body.classList.remove('add_blur');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedForm === 'login') {
      setLoading(true);
      setMessage('');

      const success = await login(username, password);
      setLoading(false);
      if (success) {
        onLogin(username);
        closeDialog();
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } else if (selectedForm === 'register') {
      setLoading(true);
      setMessage('');

      const success = await register(newUsername, newfirstname, newEmail, newPassword);
      setLoading(false);
      if (success) {
        onLogin(newUsername);
        setMessage('Registration successful!');
        closeDialog();
      } else {
        setMessage('Failed! Make sure your email is not registered.');
      }
    } else if (selectedForm === 'password-reset') {
      setMessage('');

      const success = await passwordReset(newEmail);
      if (success) {
        setMessage('Password reset email sent!');
      } else {
        setMessage('Failed! Make sure your email is already registered.');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      openDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMessage('');
  }, [selectedForm]);



  return (
    <>
      <div className='login-register-container'>
        <button onClick={openDialog} className="login-button">Login | Register</button>
      </div>
      <dialog ref={dialogRef} className="login-dialog login-modal">
        {loading && <Loader />}
        <div>

          {/* LOGIN FORM IS BELOW */}

          {selectedForm === 'login' &&
            <form method="dialog" onSubmit={handleSubmit} className="login-form">
              <span className="close-icon" onClick={closeDialog}>&times;</span>
              <h2>Login</h2>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className='text-input'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  className='text-input'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="dialog-buttons">
                <button type="submit" className="submit-button">Login</button>
              </div>
              <div className="login-links">
                <button onClick={() => setSelectedForm('register')}>Register</button>
                <button onClick={() => setSelectedForm('password-reset')}>Forgot Password?</button>
              </div>
              {/* Add Google login button */}
             <GoogleLogin onLogin={onLogin}/>
            </form>
          }

          {/* REGISTER FORM IS BELOW */}

          {selectedForm === 'register' &&
            <form method="dialog" onSubmit={handleSubmit} className="login-form" autoComplete="off">
              <span className="close-icon" onClick={closeDialog}>&times;</span>
              <h2>Register</h2>
              <div className="form-group">
                <label htmlFor="new-username">Username</label>
                <input
                  type="text"
                  id="new-username"
                  value={newUsername}
                  className='text-input'
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-username">First Name</label>
                <input
                  type="text"
                  id="mew-firstname"
                  value={newfirstname}
                  className='text-input'
                  onChange={(e) => setNewFirstname(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-email">Email</label>
                <input
                  type="email"
                  id="new-email"
                  value={newEmail}
                  className='text-input'
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Password</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  className='text-input'
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="dialog-buttons">
                <button type="submit" className="submit-button">Register</button>
              </div>
              <div className="login-links">
                <button onClick={() => setSelectedForm('login')}>Login</button>
                <button onClick={() => setSelectedForm('password-reset')}>Forgot Password?</button>
              </div>
            </form>
          }

          {/* PASSWORD RESET FORM IS BELOW */}

          {selectedForm === 'password-reset' &&
            <form method="dialog" onSubmit={handleSubmit} className="login-form">
              <span className="close-icon" onClick={closeDialog}>&times;</span>
              <h2>Reset Password</h2>
              <div className="form-group">
                <label htmlFor="reset-email">Email</label>
                <input
                  type="email"
                  id="reset-email"
                  value={newEmail}
                  className='text-input'
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="dialog-buttons">
                <button type="submit" className="submit-button">Send Reset Link</button>
              </div>
              <div className="login-links">
                <button onClick={() => setSelectedForm('login')}>Login</button>
                <button onClick={() => setSelectedForm('register')}>Register</button>
              </div>
            </form>
          }
          <br />
         <p>{message}</p> 
        </div>
      </dialog>
    </>
  );
};

export default LoginFormDialog;
