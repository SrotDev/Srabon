import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCourseCard = () => {
  const navigate = useNavigate();

  // Function to handle the click event and navigate to CreateCoursePage
  const handleCreateCourse = () => {
    navigate('/create-course'); // This will redirect to CreateCoursePage
  };

  return (
    <div className="create-course-card">
      <h3>♥️ Create Your Own Course</h3>
      <p>Choose topics you love and we’ll build a course just for you.</p>
      <button className="start-btn" onClick={handleCreateCourse}>
        Start Now
      </button>
    </div>
  );
};

export default CreateCourseCard;
