import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const AskAiCard = () => {
  const navigate = useNavigate();
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';

  return (
    <div className="ask-ai-card" onClick={() => navigate('/chats')}>
      <div className="ask-ai-content">
        <h3>{ translations[lang].chat_title }</h3>
        <p>{ translations[lang].chat_body }</p>
        <button className="ask-btn">{ translations[lang].chat_button }</button>
      </div>
    </div>
  );
};

export default AskAiCard;
