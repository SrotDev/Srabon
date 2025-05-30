import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const CreateCourseCard = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const navigate = useNavigate();

  // Function to handle the click event and navigate to CreateCoursePage
  const handleCreateCourse = () => {
    navigate('/create-course'); // This will redirect to CreateCoursePage
  };

  return (
    <div className="create-course-card">
      <h3>{translations[lang].create_course_title}</h3>
      <p>{translations[lang].create_course_body}</p>
      <button className="start-btn" onClick={handleCreateCourse}>
        {translations[lang].start}
      </button>
    </div>
  );
};

export default CreateCourseCard;
