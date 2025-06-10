import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { marked } from 'marked';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const FlashcardsPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const { courseID } = useParams();
  const location = useLocation();
  const course = location.state?.course;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcardHtml, setFlashcardHtml] = useState('');
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (course && course.flashcards && course.flashcards[currentCardIndex]) {
      const flashcardMarkdown =
        bengaliActive && course.subject !== "English"
          ? Object.values(course["flashcards-bn"][currentCardIndex])[0]
          : Object.values(course.flashcards[currentCardIndex])[0];
      const flashcardHtml = marked(flashcardMarkdown);
      setFlashcardHtml(flashcardHtml);
    }
  }, [course, currentCardIndex, bengaliActive]);

  if (!course) {
    return <div className="loading">{translations[lang].load_flashcards}</div>;
  }

  const handleNextCard = async () => {
    if (currentCardIndex < course.flashcards.length - 1) {
      // 1️⃣ Update score by +1
      try {
        await fetch(`${apiBaseUrl}/score/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ delta_score: 1 }),
        });
      } catch (err) {
        console.error('Failed to update score:', err);
      }

      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePreviousCard = async () => {
    if (currentCardIndex > 0) {
      // 2️⃣ Update score by -1
      try {
        await fetch(`${apiBaseUrl}/score/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ delta_score: -1 }),
        });
      } catch (err) {
        console.error('Failed to update score:', err);
      }

      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const nextQuiz = () => {
    navigate(`/quiz/${courseID}`, { state: { course } });
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <h1>{course.title}</h1>
        <div className="class-meta">
          <span className="class-box">Class: {localStorage.getItem('class')}</span>
          <span className="subject-box">{course.subject}</span>
        </div>
      </div>

      <div className="flashcard-container">
        <div className="flashcard">
          <div className="flashcard-text">
            <div dangerouslySetInnerHTML={{ __html: flashcardHtml }} />
          </div>
        </div>
      </div>

      <div className="flashcard-navigation">
        <button
          className="prev-btn"
          onClick={handlePreviousCard}
          disabled={currentCardIndex === 0}
        >
          {translations[lang].previous}
        </button>
        <button
          className="next-btn"
          onClick={handleNextCard}
          disabled={currentCardIndex === course.flashcards.length - 1}
        >
          {translations[lang].next}
        </button>
      </div>

      <div className="start-quiz-btn">
        <button onClick={nextQuiz}>
          {translations[lang].ready_quiz}
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
