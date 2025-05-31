import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { marked } from 'marked'; // Import the 'marked' library for markdown parsing
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const CourseArticlePage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const location = useLocation();
  const { name } = useParams();
  const course = location.state?.course; // Receive the course data via props
  const [articleHtml, setArticleHtml] = useState(''); // State to store the converted HTML of the article
  const navigate = useNavigate();

  useEffect(() => {
    if (!course || !course.article) return;

    // Convert the Markdown article to HTML
    const htmlContent = bengaliActive && course.subject != "English" ? marked(course["article-bn"]) : marked(course.article);
    setArticleHtml(htmlContent); // Set the converted HTML to the state
  }, [course, bengaliActive]);

  if (!course) {
    return <div className="loading">{translations[lang].load_article}</div>;
  }

  const handleSeeFlashcards = () => {
    navigate(`/flashcards/${name}`, { state: { course } });
  };

  return (
    <>
    <div className="course-article-page">
      <div className="article-header">
        <h1>{course.title}</h1>
        <div className="class-meta">
          <span className="class-box">Class: {localStorage.getItem('class')}</span>
          <span className="subject-box">{course.subject}</span>
        </div>
      </div>

      <div className="article-content">
        <h2>{ translations[lang].article }</h2>
        <div className="article-text">
          <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </div>
      </div>

      <div className="flashcards-btn">
        <button onClick={handleSeeFlashcards}>
          { translations[lang].see_flashcards }
        </button>
      </div>
    </div>
    </>
  );
};


export default CourseArticlePage;
