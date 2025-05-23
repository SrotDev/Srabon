import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectedSubjectsCard = ({ subjects }) => {
  const navigate = useNavigate();

  return (
    <div className="selected-subjects-card" onClick={() => navigate('/courses')}>
      <h4>⭐ Selected Subjects</h4>
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
