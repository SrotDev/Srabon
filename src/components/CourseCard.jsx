import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations.jsx";

const CourseCard = ({ course }) => {
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";

  const [imageUrl, setImageUrl] = useState(null);
  const [completed, setCompleted] = useState(0);
  const navigate = useNavigate();

  const { courseID, author_name, title, subtitle, subject } = course || {};

  useEffect(() => {
    if (!courseID || !subject) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${subject}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const data = await res.json();
        const image = data.results[0]?.urls?.regular;
        setImageUrl(
          image || "https://via.placeholder.com/300x180?text=No+Image"
        );
      } catch (err) {
        console.error("Error fetching image from Unsplash:", err);
        setImageUrl("https://via.placeholder.com/300x180?text=Error");
      }
    };

    const fetchPersonalStat = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/personal-course-stats/${courseID}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        const quizCompleted =
          data.previous_answers && data.previous_answers.length > 0 ? 1 : 0;
        setCompleted(
          (data.description_read || 0) +
            (data.articles_read || 0) +
            (data.flashcards_read || 0) +
            quizCompleted
        );
      } catch (err) {
        console.error("Error fetching course stats:", err);
      }
    };

    fetchImage();
    fetchPersonalStat();
  }, [courseID, subject, UNSPLASH_ACCESS_KEY]);

  const courseTitle =
    bengaliActive && subject !== "English" ? course["title-bn"] : title;

  const courseSubtitle =
    bengaliActive && subject !== "English" ? course["subtitle-bn"] : subtitle;

  return (
    <div className="course-card">
      <img className="course-image" src={imageUrl} alt={subject} />
      <div className="course-body">
        <div className="progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completed / 4) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="tags">
          <span className="tagOne">{subject}</span>
          <span className="tagTwo">{author_name}</span>
        </div>
        <h3 className="title">{courseTitle}</h3>
        <p className="desc">{courseSubtitle}</p>
        <button
          className="start-btn"
          onClick={() =>
            navigate(`/courses/${courseID}`, { state: { courseID } })
          }
        >
          {translations[lang].view_course}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
