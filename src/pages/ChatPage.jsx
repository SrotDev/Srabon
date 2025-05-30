import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const ChatPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
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
      const response = await fetch(`${apiBaseUrl}/chats/`, {
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
      text: `${ translations[lang].greeting_title}${name}! ${ translations[lang].chat_start }`
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
          <h2>{ translations[lang].chat_head }</h2>
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
              <div className="markdown-message">{ translations[lang].ai_type }</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            placeholder={translations[lang].new_msg}
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
