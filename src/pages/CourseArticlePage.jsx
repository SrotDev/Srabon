import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { marked } from 'marked';
import { FaVolumeUp } from 'react-icons/fa';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const CourseArticlePage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const location = useLocation();
  const { name } = useParams();
  const course = location.state?.course;
  const [articleHtml, setArticleHtml] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();

  const stopSpeaking = () => {
    if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!course || !course.article) return;
    const htmlContent = bengaliActive && course.subject !== "English"
      ? marked(course["article-bn"])
      : marked(course.article);
    setArticleHtml(htmlContent);
  }, [course, bengaliActive]);

  // Stop speaking when bengaliActive changes
  useEffect(() => {
    stopSpeaking();
  }, [bengaliActive]);

  // Stop speaking on location change
  useEffect(() => {
    stopSpeaking();
  }, [location]);

  // Stop speaking when component unmounts (leaving page)
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!course) {
    return <div className="loading">{translations[lang].load_article}</div>;
  }

  const handleSeeFlashcards = () => {
    stopSpeaking();
    navigate(`/flashcards/${name}`, { state: { course } });
  };

  const speakArticle = () => {
    stopSpeaking();

    const title = bengaliActive && course.subject !== "English" ? course["title-bn"] : course.title;
    const contentText = document.querySelector('.article-text')?.innerText || '';
    const textToSpeak = `${title}. ${contentText}`;
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

  return (
    <div className="course-article-page">
      <div className="article-header">
        <h1>{bengaliActive && course.subject !== "English" ? course["title-bn"] : course.title}</h1>
        <div className="meta-row">
          <span className="class-box">Class: {localStorage.getItem('class')}</span>
          <div className="subject-sound">
            <span className="subject-box">{course.subject}</span>
            <button
              onClick={speakArticle}
              className={`play-sound-btn ${isSpeaking ? 'active' : ''}`}
              title={isSpeaking ? "Stop" : "Play"}
            >
              <FaVolumeUp size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="article-content">
        <h2>{translations[lang].article}</h2>
        <div className="article-text" dangerouslySetInnerHTML={{ __html: articleHtml }} />
      </div>

      <div className="flashcards-btn">
        <button onClick={handleSeeFlashcards}>
          {translations[lang].see_flashcards}
        </button>
      </div>
    </div>
  );
};

export default CourseArticlePage;
