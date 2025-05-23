import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const isFirstMessage = useRef(true);
  const chatEndRef = useRef(null);

  const handleMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending) return;

    const newMessage = { from: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, newMessage]);
    setUserMessage('');
    setIsSending(true);
    setAiTyping(true);

    try {
      const response = await fetch("https://srabonbackend3.onrender.com/api/chats/", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message: newMessage.text,
          limit: isFirstMessage.current ? "false" : "true"
        }),
      });

      const data = await response.json();
      const aiMessage = { from: 'ai', text: data.message };
      setChatHistory((prev) => [...prev, aiMessage]);
      isFirstMessage.current = false;
    } catch (error) {
      console.error('Error while sending message:', error);
    } finally {
      setAiTyping(false);
      setIsSending(false);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("name") || "there";
    const welcomeMessage = {
      from: 'ai',
      text: `Hi ${name}! I'm your friend আভা. I'm here to support you with your studies, clarify doubts, or just have a chat. Ask me anything to get started! 🚀`
    };
    setChatHistory([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button onClick={() => navigate('/functionalities')} className="back-button">← Back</button>
          <h2>Chat with আভা.AI</h2>
        </div>

        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.from}`}>
              <div
                className="markdown-message"
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              />
            </div>
          ))}
          {aiTyping && (
            <div className="chat-message ai typing">
              <div className="markdown-message">AI is typing...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            placeholder="Type a new message here"
            value={userMessage}
            onChange={handleMessageChange}
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
            disabled={isSending || !userMessage.trim()}
          >
            <span className="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
