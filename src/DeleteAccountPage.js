// DeleteAccountPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DeleteAccountPage.css';

const DeleteAccountPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleDelete = async () => {
    // Here, make an API call to delete the account
    // After deletion, you can redirect the user to the login or home page
    try {
      await axios.delete('http://localhost:8000/auth/delete', { data: { username, password } });
      setTimeout(() => {
        setMessage('Account deleted successfully.');
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="container">
    <h2 className="header">Delete Your Account</h2>
    <p>Are you sure you want to delete your account? This action is irreversible.</p>
    <div className="input-container">
      username: <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
    <div className="input-container">
      password: <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <button className="button" onClick={() => setShowModal(true)}>Delete Account</button>
    <div className="message">{message}</div>

    {showModal && (
      <div className="modal">
        <p>Are you sure you want to proceed? This action cannot be undone.</p>
        <button className="button" onClick={handleDelete}>Yes, Delete</button>
        <button className={`button button-secondary`} onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    )}
  </div>
  );
};

export default DeleteAccountPage;
