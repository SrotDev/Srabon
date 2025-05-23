import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuizPage = () => {
  const { name } = useParams();
  const location = useLocation();
  const course = location.state?.course;
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(6).fill(null));

  if (!course) {
    return <div className="loading">Loading quiz...</div>;
  }

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const total = course.questions.length;
  let score = 0;

  selectedAnswers.forEach((answerIndex, index) => {
    if (answerIndex !== null) {
      const selectedValue = course.questions[index][['option1', 'option2', 'option3', 'option4'][answerIndex]];
      const correctAnswer = course.questions[index].ans;

      if (selectedValue.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        score += 1;
      }

      console.log({
        answerIndex,
        selectedValue,
        correctAnswer,
        matched: selectedValue.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      });
    }
  });

  toast.success(`You scored ${score}/${total}!`);
  navigate('/courses');
};



  return (
    <div className="quiz-form-page">
      <div className="quiz-form-header">
        <h1>{course.title} - Quiz</h1>
        <div className="class-meta">
          <span className="class-box">Class: {localStorage.getItem('class')}</span>
          <span className="subject-box">{course.subject}</span>
        </div>
      </div>

      <form className="quiz-form" onSubmit={handleSubmit}>
        {course.questions.map((q, qIndex) => (
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
        <button type="submit" className="submit-quiz-btn">Submit Quiz</button>
      </form>
    </div>
  );
};

export default QuizPage;