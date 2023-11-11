import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const ws = useRef(null);

  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      // ログアウトAPIを呼び出し
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ログアウト時にはトークンを送信して認証を行うこともあります
          // "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // ログアウト成功時の処理
        setMessage("Logout successful!");
        // ログアウト後、ログインページにリダイレクトするなど
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        // ログアウト失敗時の処理
        setMessage("Error logging in. Please try again.");
      }
    } catch (error) {
        setMessage(error.message)
    }
  }

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
      <div>
      {/* チャットコンポーネントの表示 */}
      <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        {message}
      </div>
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
