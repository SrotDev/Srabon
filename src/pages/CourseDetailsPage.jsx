import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { FaVolumeUp } from 'react-icons/fa';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';
import { toast } from 'react-toastify'; // 📌 Import toast!

const CourseDetailsPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const { courseID } = location.state || {};
  const [course, setCourse] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stopSpeaking = () => {
    if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!courseID) return;

    const fetchCourseData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/courses/${courseID}/`, {
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
        setCourse(data);
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
        const image = imageData.results[0]?.urls?.regular;
        setImageUrl(image || 'https://via.placeholder.com/300x180?text=No+Image');
      } catch (err) {
        console.error('Error fetching image from Unsplash:', err);
        setImageUrl('https://via.placeholder.com/300x180?text=Error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseID]);

  // Stop speaking when bengaliActive changes
  useEffect(() => {
    stopSpeaking();
  }, [bengaliActive]);

  // Stop speaking on location (route) change
  useEffect(() => {
    stopSpeaking();
  }, [location]);

  // Stop speaking when component unmounts (leaving page)
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleEnrollNow = async () => {
    stopSpeaking();

    try {
      const res = await fetch(`${apiBaseUrl}/score/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ delta_score: 5 }),
      });

      if (res.ok) {
        const data = await res.json();
        const totalScore = data.score;
        toast.success(`${translations[lang].toast_score_increased}${totalScore}`);
      } else {
        console.error('Failed to update score');
        toast.error('Failed to update score');
      }
    } catch (err) {
      console.error('Error updating score:', err);
      toast.error('Error updating score');
    }

    navigate(`/courseArticle/${courseID}`, { state: { course } });
  };

  const handleAllCourses = () => {
    stopSpeaking();
    navigate('/courses');
  };

  const speakCourseDetails = () => {
    stopSpeaking();
    if (!course) return;

    const title = bengaliActive && course.subject !== "English" ? course["title-bn"] : course.title;
    const description = bengaliActive && course.subject !== "English" ? course["description-bn"] : course.description;
    const textToSpeak = `${title}. ${description}`;
    const voice = bengaliActive ? "Bangla India Female" : "US English Female";

    if (!isSpeaking) {
      if (window.responsiveVoice) {
        window.responsiveVoice.speak(textToSpeak, voice, { onend: () => setIsSpeaking(false) });
      } else if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = bengaliActive ? "bn-IN" : "en-US";
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
      setIsSpeaking(true);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>
    );
  }

  const courseTitle = bengaliActive && course.subject !== "English"
    ? course["title-bn"]
    : course.title;

  const courseDescription = bengaliActive && course.subject !== "English"
    ? course["description-bn"]
    : course.description;

  return (
    <div className="course-details">
      <div className="details-header">
        <h1>{courseTitle.toUpperCase()}</h1>
      </div>

      <div className="course-meta">
        <p className="class-box">Class: {localStorage.getItem('class')}</p>
        <p className="subject-box">
          {course.subject}
          <button
            onClick={speakCourseDetails}
            className={`play-sound-btn ${isSpeaking ? 'active' : ''}`}
            title={isSpeaking ? "Stop" : "Play"}
          >
            <FaVolumeUp size={18} />
          </button>
        </p>
      </div>

      <div className="subtitle">{translations[lang].desc}</div>

      <div className="course-content">
        <div className="description">
          <img src={imageUrl} alt={course.subject} className="course-image" />
          <p>{courseDescription || 'No description available.'}</p>
        </div>
      </div>

      <div className="buttons">
        <button className="all-courses-btn" onClick={handleAllCourses}>
          {translations[lang].all_courses}
        </button>
        <button className="enroll-btn" onClick={handleEnrollNow}>
          {translations[lang].start_course}
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
