import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';


const CourseCard = ({ course }) => {
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
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
          { translations[lang].view_course }
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
