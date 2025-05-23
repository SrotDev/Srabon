import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { marked } from 'marked'; // Import the 'marked' library for markdown parsing

const CourseArticlePage = () => {
  const location = useLocation();
  const { name } = useParams();
  const course = location.state?.course; // Receive the course data via props
  const [articleHtml, setArticleHtml] = useState(''); // State to store the converted HTML of the article
  const navigate = useNavigate();

  useEffect(() => {
    if (!course || !course.article) return;

    // Convert the Markdown article to HTML
    const htmlContent = marked(course.article);
    setArticleHtml(htmlContent); // Set the converted HTML to the state
  }, [course]);

  if (!course) {
    return <div className="loading">Loading article...</div>;
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
        <h2>Article</h2>
        <div className="article-text">
          <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </div>
      </div>

      <div className="flashcards-btn">
        <button onClick={handleSeeFlashcards}>
          See Flashcards
        </button>
      </div>
    </div>
    </>
  );
};


export default CourseArticlePage;
