import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { marked } from 'marked'; // Import the 'marked' library for markdown parsing
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const FlashcardsPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const { name } = useParams(); // Get the course name from the URL parameter
  const location = useLocation();
  const course = location.state?.course; // Receive the course data via props

  const [currentCardIndex, setCurrentCardIndex] = useState(0); // To track flashcard index
  const [flashcardHtml, setFlashcardHtml] = useState(''); // State to store the converted HTML of flashcard content
  const navigate = useNavigate();

  useEffect(() => {
    if (course && course.flashcards && course.flashcards[currentCardIndex]) {
      // Convert the markdown content of the flashcard to HTML
      const flashcardMarkdown = bengaliActive && course.subject != "English" ? Object.values(course["flashcards-bn"][currentCardIndex])[0]: Object.values(course.flashcards[currentCardIndex])[0];
      const flashcardHtml = marked(flashcardMarkdown);
      setFlashcardHtml(flashcardHtml); // Set the converted HTML
    }
  }, [course, currentCardIndex, bengaliActive]);

  if (!course) {
    return <div className="loading">{translations[lang].load_flashcards}</div>;
  }

  const handleNextCard = () => {
    if (currentCardIndex < course.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const nextQuiz = () => {
    navigate(`/quiz/${name}`, { state: { course } });
    console.log(name);
  }

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
            {/* Render the converted HTML content */}
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
