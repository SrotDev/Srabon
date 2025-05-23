import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader"; // ✅ Spinner

const CreateCoursePage = () => {
  const [courseSubject, setCourseSubject] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const handleSubjectChange = (e) => setCourseSubject(e.target.value);
  const handleTitleChange = (e) => setCourseTitle(e.target.value);

  const handleGenerateCourse = async () => {
    if (!courseSubject || !courseTitle) {
      toast.error('Please fill both the subject and title fields.');
      return;
    }

    setLoading(true); // ✅ Show spinner

    try {
      const response = await fetch("https://srabonbackend3.onrender.com/api/addcourses/", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ subject: courseSubject, title: courseTitle }),
      });

      if (response.ok) {
        toast.success('Course Generated Successfully');
        setTimeout(() => {
          navigate('/courses'); // ✅ Redirect after a slight delay (optional)
        }, 1000);
      } else {
        throw new Error('Failed to generate course');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false); // ✅ Hide spinner
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-form">
        <h2>Create AI Generated Course</h2>

        <div className="form-field">
          <label htmlFor="course-subject">Course Subject</label>
          <input
            type="text"
            id="course-subject"
            value={courseSubject}
            onChange={handleSubjectChange}
            placeholder="Enter course subject"
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="course-title">Course Title</label>
          <input
            type="text"
            id="course-title"
            value={courseTitle}
            onChange={handleTitleChange}
            placeholder="Enter course title"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button onClick={handleGenerateCourse} className="generate-btn" disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {loading && (
          <div className="spinner-container" >
            <ClipLoader color="#27d887" loading={true} size={35} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCoursePage;
