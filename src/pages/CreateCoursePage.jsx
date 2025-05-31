import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const CreateCoursePage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';

  const [courseSubject, setCourseSubject] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null); // ✅ New state for PDF
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubjectChange = (e) => setCourseSubject(e.target.value);
  const handleTitleChange = (e) => setCourseTitle(e.target.value);
  const handlePdfFileChange = (e) => setPdfFile(e.target.files[0]); // ✅ Store file

  const handleGenerateCourse = async () => {
    if (!courseSubject || !courseTitle) {
      toast.error(translations[lang].fill_both);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("subject", courseSubject);
      formData.append("title", courseTitle);
      if (pdfFile) formData.append("file", pdfFile); // ✅ Optional file

      const response = await fetch(`${apiBaseUrl}/addcourses/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(translations[lang].course_success);
        setTimeout(() => {
          navigate('/courses');
        }, 1000);
      } else {
        throw new Error(translations[lang].course_failed);
      }
    } catch (error) {
      toast.error(error.message || translations[lang].something_wrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-form">
        <h2>{translations[lang].ai_gen_course}</h2>

        <div className="form-field">
          <label htmlFor="course-subject">{translations[lang].course_sub}</label>
          <input
            type="text"
            id="course-subject"
            value={courseSubject}
            onChange={handleSubjectChange}
            placeholder={translations[lang].enter_course_sub}
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="course-title">{translations[lang].ai_gen_title}</label>
          <input
            type="text"
            id="course-title"
            value={courseTitle}
            onChange={handleTitleChange}
            placeholder={translations[lang].enter_course_title}
            disabled={loading}
          />
        </div>

        {/* ✅ Optional PDF upload */}
        <div className="form-field">
          <label htmlFor="pdf-upload">{translations[lang].optional_pdf || "Optional PDF"}</label>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            onChange={handlePdfFileChange}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button onClick={handleGenerateCourse} className="generate-btn" disabled={loading}>
            {loading ? translations[lang].generating : translations[lang].generate}
          </button>
        </div>

        {loading && (
          <div className="spinner-container">
            <ClipLoader color="#27d887" loading={true} size={35} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCoursePage;
