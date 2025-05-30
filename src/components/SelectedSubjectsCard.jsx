import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const SelectedSubjectsCard = ({ subjects }) => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const navigate = useNavigate();

  return (
    <div className="selected-subjects-card" onClick={() => navigate('/courses')}>
      <h4>{ translations[lang].selected_subjects }</h4>
      <div className="subject-tags">
        {subjects.map((subj, idx) => (
          <span className={`subject-pill ${subj.toLowerCase()}`} key={idx}>
            {subj}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SelectedSubjectsCard;
