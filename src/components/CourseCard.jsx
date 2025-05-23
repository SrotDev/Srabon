import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UNSPLASH_ACCESS_KEY = 'ZjJbjMdMJ7IyEH-Ou4zW4Ub1x_3iZKdl7jkK2Cp3ZKw';

const CourseCard = ({ course }) => {
  const { name, title, subtitle, subject } = course;
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${subject}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const data = await res.json();
        const image = data.results[0]?.urls?.regular;
        setImageUrl(image || 'https://via.placeholder.com/300x180?text=No+Image');
      } catch (err) {
        console.error('Error fetching image from Unsplash:', err);
        setImageUrl('https://via.placeholder.com/300x180?text=Error');
      }
    };

    fetchImage();
  }, [subject]);


  return (
    <div className="course-card">
      <img className="course-image" src={imageUrl} alt={subject} />
      <div className="course-body">
        <span className="tag">{subject}</span>
        <h3 className="title">{title}</h3>
        <p className="desc">{subtitle}</p>
        <button className="start-btn" onClick={() => navigate(`/courses/${name}`, { state: { name } })}>
          View Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
