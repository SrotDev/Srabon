import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { marked } from 'marked'; // Import the 'marked' library for markdown parsing

const FlashcardsPage = () => {
  const { name } = useParams(); // Get the course name from the URL parameter
  const location = useLocation();
  const course = location.state?.course; // Receive the course data via props

  const [currentCardIndex, setCurrentCardIndex] = useState(0); // To track flashcard index
  const [flashcardHtml, setFlashcardHtml] = useState(''); // State to store the converted HTML of flashcard content
  const navigate = useNavigate();

  useEffect(() => {
    if (course && course.flashcards && course.flashcards[currentCardIndex]) {
      // Convert the markdown content of the flashcard to HTML
      const flashcardMarkdown = Object.values(course.flashcards[currentCardIndex])[0];
      const flashcardHtml = marked(flashcardMarkdown);
      setFlashcardHtml(flashcardHtml); // Set the converted HTML
    }
  }, [course, currentCardIndex]);

  if (!course) {
    return <div className="loading">Loading flashcards...</div>;
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
          Previous
        </button>
        <button 
          className="next-btn" 
          onClick={handleNextCard}
          disabled={currentCardIndex === course.flashcards.length - 1}
        >
          Next
        </button>
      </div>

      <div className="start-quiz-btn">
        <button onClick={nextQuiz}>
          Ready For Quiz
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
