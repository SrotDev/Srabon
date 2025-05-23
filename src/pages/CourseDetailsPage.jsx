import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

// Unsplash Access Key
const UNSPLASH_ACCESS_KEY = 'ZjJbjMdMJ7IyEH-Ou4zW4Ub1x_3iZKdl7jkK2Cp3ZKw';

const CourseDetailsPage = () => {
  const location = useLocation(); // Get location from the router
  const { name } = location.state || {}; // Get course name passed from CourseCard
  const [course, setCourse] = useState(null); // Store the course data
  const [imageUrl, setImageUrl] = useState(null); // Store the fetched image URL
  const navigate = useNavigate(); // For navigation
  const [loading, setLoading] = useState(true);

  // Fetch course data from backend API
  useEffect(() => {
    if (!name) {
      console.log("Nam nai");
      return;
    }; // If no course name is provided, stop

    const fetchCourseData = async () => {
      try {
        const res = await fetch(`https://srabonbackend3.onrender.com/api/courses/${name}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch course data:', res.status);
          return;
        }

        const data = await res.json();
        console.log('Fetched course data:', data); // Log the data
        setCourse(data); // Store the course data

        // Fetch image from Unsplash API based on the course subject
        fetchImage(data.subject);
      } catch (err) {
        console.error('Error fetching course data:', err);
      }
    };

    const fetchImage = async (subject) => {
      try {
        const imageRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${subject}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        const imageData = await imageRes.json();
        console.log('Fetched image data:', imageData); // Log the image data
        const image = imageData.results[0]?.urls?.regular;
        setImageUrl(image || 'https://via.placeholder.com/300x180?text=No+Image');
      } catch (err) {
        console.error('Error fetching image from Unsplash:', err);
        setImageUrl('https://via.placeholder.com/300x180?text=Error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData(); // Call the function to fetch course data
  }, [name]); // Trigger when 'name' changes

  const handleEnrollNow = () => {
    // Navigate to CourseArticlePage with course data
    navigate(`/courseArticle/${name}`, { state: { course } });
    console.log("Ahis");
    console.log(course);
  };

  const handleAllCourses = () => {
    navigate('/courses');
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="course-details">
      <div className="details-header">
        <h1>{course.title.toUpperCase()}</h1>
      </div>

      <div className="course-meta">
        <p className="class-box">Class: {localStorage.getItem('class')}</p>
        <p className="subject-box">{course.subject}</p>
        {/* <button className="share-btn">Share</button> */}
      </div>

      <div className="subtitle">Description</div>
      <div className="course-content">
        <div className="description">
          <img src={imageUrl} alt={course.subject} className="course-image" />
          <p>{course.description || 'No description available.'}</p>
        </div>
      </div>

      <div className="buttons">
        <button className="all-courses-btn" onClick={handleAllCourses}>See All Courses</button>
        <button className="enroll-btn" onClick={handleEnrollNow}>Start Course</button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
