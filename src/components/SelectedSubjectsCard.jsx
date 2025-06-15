import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const SelectedSubjectsCard = ({ subjects }) => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const navigate = useNavigate();

  // Define the allowed subjects
  const allowedSubjects = [
    "physics", "chemistry", "math", "history",
    "economics", "biology", "agriculture", "english"
  ];

  // Function to randomly assign class if the subject is not in the allowed list
  const getRandomClass = () => {
    const randomClasses = ['randomOne', 'randomTwo', 'randomThree'];
    const randomIndex = Math.floor(Math.random() * randomClasses.length);
    return randomClasses[randomIndex];
  };

  return (
    <div className="selected-subjects-card" onClick={() => navigate('/courses')}>
      <h4>{translations[lang].selected_subjects}</h4>
      <div className="subject-tags">
        {subjects.map((subj, idx) => {
          // Check if subj.toLowerCase() is in allowedSubjects
          const className = allowedSubjects.includes(subj.toLowerCase())
            ? `subject-pill ${subj.toLowerCase()}`
            : `subject-pill ${getRandomClass()}`;

          return (
            <span className={className} key={idx}>
              {subj}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedSubjectsCard;
