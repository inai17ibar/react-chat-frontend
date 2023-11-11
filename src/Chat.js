import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  //console.log("Chat component rendered");

  useEffect(() => {
    console.log("UseEffect called");
      // 保存してあるJWTを取得する (例: localStorageから)
      const token = localStorage.getItem('token');
      try {
        if (token) {
          // JWTデコードを試みる
          const decodedToken = jwtDecode(token);
          console.log("デコードされたトークン:", decodedToken);
          // ペイロードに含まれるユーザー名を取得する
          const name = decodedToken.name;
          console.log(name);
          setUsername(name);
        } else {
          setUsername("guest");
        }
      } catch (error) {
        console.error("JWTデコードエラー:", error);
        setUsername("guest");
      }
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        ws.current = new WebSocket('ws://localhost:8000/ws');
        ws.current.onopen = () => {
          setIsConnected(true);
          console.log("connected");
        }
        ws.current.onmessage = (e) => {
          const msg = JSON.parse(e.data);
          console.log("Received from server:", msg);
          setMessages(prev => [...prev, msg]);
        };
        ws.current.onclose = () => {
          setIsConnected(false);
          console.log("disconnected");
        }
        ws.current.onerror = (err) => {
          console.log("connection error:", err);
        };
      }
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const messageObj = { username: username, message: inputValue };
      if (ws.current && isConnected) {
        ws.current.send(JSON.stringify(messageObj));
        console.log("Sending to server:", messageObj);
      }
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <h4>Your username: {username}</h4>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.username === username ? 'self' : 'other'}`}>
            <strong>{message.username}:</strong> {message.message}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
