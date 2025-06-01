import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const QuizPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const { name } = useParams();
  const location = useLocation();
  const course = location.state?.course;
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(6).fill(null));

  if (!course) {
    return <div className="loading">{translations[lang].load_quiz}</div>;
  }

  // 🟩 Use Bengali questions if conditions met
  const questions =
    bengaliActive && course.subject !== "English"
      ? course["questions-bn"]
      : course.questions;

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = questions.length;
    let score = 0;

    selectedAnswers.forEach((answerIndex, index) => {
      if (answerIndex !== null) {
        const selectedValue = questions[index][['option1', 'option2', 'option3', 'option4'][answerIndex]];
        const correctAnswer = questions[index].ans;

        if (selectedValue.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          score += 1;
        }
      }
    });

    toast.success(`${translations[lang].your_score}${score}/${total}!`);

    // Navigate to quiz solution page with data
    navigate(`/quizSolution/${name}`, {
      state: {
        course,
        selectedAnswers,
        score
      }
    });
  };

  const courseTitle =
    bengaliActive && course.subject !== "English"
      ? course["title-bn"]
      : course.title;

  return (
    <div className="quiz-form-page">
      <div className="quiz-form-header">
        <h1>{courseTitle}{translations[lang].quiz_end}</h1>
        <div className="class-meta">
          <span className="class-box">Class: {localStorage.getItem('class')}</span>
          <span className="subject-box">{course.subject}</span>
        </div>
      </div>

      <form className="quiz-form" onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="quiz-question">
            <h3>Q{qIndex + 1}: {q.question}</h3>
            <div className="options">
              {['option1', 'option2', 'option3', 'option4'].map((key, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={index}
                    checked={selectedAnswers[qIndex] === index}
                    onChange={() => handleAnswerChange(qIndex, index)}
                  />
                  {q[key]}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="submit-quiz-btn">{translations[lang].submit_quiz}</button>
      </form>
    </div>
  );
};

export default QuizPage;
