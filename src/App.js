import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Chat from './Chat';

function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setMessage("Login successful!");
        setTimeout(() => {
          navigate("/chat");
        }, 1000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Error logging in. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/auth/register', { username, password });
      setMessage('Registered successfully. You can now login.');
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="App">
    <h1>Login and Registration</h1>
    
    <div className="login-form">
        <div>
            <label>Username:</label>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
    
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
    </div>
    
    <div className="message">{message}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        {/* ここに"/chat"のルーティングを追加する際に、ChatComponentも追加する必要があります */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
