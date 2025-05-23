import React from 'react';
import { useNavigate } from 'react-router-dom';

const AskAiCard = () => {
  const navigate = useNavigate();

  return (
    <div className="ask-ai-card" onClick={() => navigate('/chats')}>
      <div className="ask-ai-content">
        <h3>🧠 Solve your doubts with আভা</h3>
        <p>Our intelligent assistant is ready to help you understand tough topics, answer tricky questions, or even summarize lessons for you.</p>
        <button className="ask-btn">Talk Now</button>
      </div>
    </div>
  );
};

export default AskAiCard;
