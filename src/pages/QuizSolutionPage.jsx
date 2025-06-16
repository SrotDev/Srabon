import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const QuizSolutionPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const location = useLocation();
  const navigate = useNavigate();

  const { course, selectedAnswers, score } = location.state || {};
  console.log("QuizSolutionPage selectedAnswers:", selectedAnswers);

  if (!course || !selectedAnswers) {
    return <div className="qs-loading">{translations[lang].load_quiz}</div>;
  }

  const questions =
    bengaliActive && course.subject !== "English"
      ? course["questions-bn"]
      : course.questions;

  const courseTitle =
    bengaliActive && course.subject !== "English"
      ? course["title-bn"]
      : course.title;

  return (
    <div className="qs-page">
      <div className="qs-container">
        <div className="qs-header">
          <h1>{courseTitle}{translations[lang].quiz_solution}</h1>
          <div className="qs-class-meta">
            <span className="qs-class-box">Class: {localStorage.getItem('class')}</span>
            <span className="qs-subject-box">{course.subject}</span>
          </div>
          <div className="qs-score-box">{translations[lang].your_score}{score}/{questions.length}</div>
        </div>

        <div className="qs-content">
          {questions.map((q, qIndex) => {
            const correctAnswer = q.ans.trim().toLowerCase();
            const selectedLetter = selectedAnswers[qIndex];
            const selectedIndex = 'ABCD'.indexOf(selectedLetter);
            const selectedValue =
              selectedLetter !== '0'
                ? q[['option1', 'option2', 'option3', 'option4'][selectedIndex]]
                : null;

            return (
              <div key={qIndex} className="qs-question">
                <h3>Q{qIndex + 1}: {q.question}</h3>
                <div className="qs-options">
                  {['option1', 'option2', 'option3', 'option4'].map((key, index) => {
                    const optionValue = q[key];
                    const isCorrect =
                      optionValue.trim().toLowerCase() === correctAnswer;
                    const isSelected =
                      selectedIndex === index &&
                      optionValue.trim().toLowerCase() !== correctAnswer;

                    return (
                      <div
                        key={index}
                        className={`qs-option ${isCorrect ? 'qs-correct' : ''} ${isSelected ? 'qs-incorrect' : ''}`}
                      >
                        {optionValue}
                      </div>
                    );
                  })}
                </div>
                <div className="qs-explanation">
                  <h4>{translations[lang].explanation}</h4>
                  <p>{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="qs-footer">
          <button
            className="qs-all-courses-btn"
            onClick={() => navigate('/courses')}
          >
            {translations[lang].all_courses}
          </button>
          <button
            className="qs-leaderboard-btn"
            onClick={() => navigate('/leaderboard')}
          >
            {translations[lang].see_leaderboard}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSolutionPage;
