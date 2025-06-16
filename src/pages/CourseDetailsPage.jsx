import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FaVolumeUp, FaArrowLeft, FaShareAlt } from "react-icons/fa";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations.jsx";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

const CourseDetailsPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const { courseID } = location.state || {};
  const [course, setCourse] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [articlesRead, setArticlesRead] = useState(false);
  const [flashcardsRead, setFlashcardsRead] = useState(false);
  const [QuizRead, setQuizRead] = useState(false);
  const [previousAnswers, setPreviousAnswers] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const stopSpeaking = () => {
    if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const createNotification = async (message) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiBaseUrl}/notifications/make/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  useEffect(() => {
    if (!courseID) return;

    const fetchCourseData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/courses/${courseID}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setCourse(data);
        fetchImage(data.subject);
        fetchPersonalStat();
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };

    const fetchImage = async (subject) => {
      try {
        const imageRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${subject}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const imageData = await imageRes.json();
        const image = imageData.results[0]?.urls?.regular;
        setImageUrl(
          image || "https://via.placeholder.com/300x180?text=No+Image"
        );
      } catch {
        setImageUrl("https://via.placeholder.com/300x180?text=Error");
      } finally {
        setLoading(false);
      }
    };

    const fetchPersonalStat = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/personal-course-stats/${courseID}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setArticlesRead(data.articles_read === 1);
        setFlashcardsRead(data.flashcards_read === 1);
        setQuizRead(data.previous_answers && data.previous_answers.length > 0);
        setPreviousAnswers(data.previous_answers || null);
        setQuizScore(data.quiz_score || 0);
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };

    fetchCourseData();
  }, [courseID]);

  useEffect(() => {
    stopSpeaking();
  }, [bengaliActive, location]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleShare = () => {};

  const handleEnrollNow = async (navigationPath) => {
    stopSpeaking();

    try {
      // Step 1: Update score
      const res = await fetch(`${apiBaseUrl}/score/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ delta_score: 5 }),
      });

      if (res.ok) {
        const data = await res.json();
        const message = `${translations[lang].toast_score_increased}${data.score}`;
        toast.success(message);
        createNotification(message);
      } else {
        toast.error("Failed to update score");
      }

      // ✅ Step 2: Safely try updating personal stat
      try {
        await fetch(`${apiBaseUrl}/personal-course-stats/${courseID}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            description_read: 1,
          }),
        });
      } catch (err) {
        console.error("Failed to update personal course stat:", err);
        toast.warning("Progress not saved, but you can continue.");
      }

      // Step 3: Navigate regardless
      navigate(`/${navigationPath}/${courseID}`, { state: { course } });
    } catch (error) {
      toast.error("Something went wrong while enrolling");
      console.error("handleEnrollNow error:", error);
    }
  };

  const handlePastQuiz = () => {
    stopSpeaking();
    if (!course) return;
    if (!previousAnswers || typeof previousAnswers !== "string") {
      toast.error("No past quiz data found.");
      return;
    }

    const selectedAnswers = previousAnswers.split("");

    navigate(`/quizSolution/${courseID}`, {
      state: {
        course,
        selectedAnswers,
        score: quizScore,
      },
    });
  };

  const handleDownloadPDF = async () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(
        `${apiBaseUrl}/coursecontent/${courseID}/en/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Course_${courseID}_en.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
      const msg = `Downloaded ${courseTitle} PDF successfully!`;
      toast.success(msg)
      createNotification(msg);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF.");
    }
  };

  const handleAllCourses = () => {
    stopSpeaking();
    navigate("/courses");
  };

  const speakCourseDetails = () => {
    stopSpeaking();
    if (!course) return;

    const title =
      bengaliActive && course.subject !== "English"
        ? course["title-bn"]
        : course.title;
    const description =
      bengaliActive && course.subject !== "English"
        ? course["description-bn"]
        : course.description;
    const textToSpeak = `${title}. ${description}`;
    const voice = bengaliActive ? "Bangla India Female" : "US English Female";

    if (!isSpeaking) {
      if (window.responsiveVoice) {
        window.responsiveVoice.speak(textToSpeak, voice, {
          onend: () => setIsSpeaking(false),
        });
      } else if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = bengaliActive ? "bn-IN" : "en-US";
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
      setIsSpeaking(true);
    }
  };

  if (loading) {
    return createPortal(
        <div className="spinner-container">
          <ClipLoader color="#27d887" loading={true} size={50} />
        </div>, document.body
      );
  }

  const courseTitle =
    bengaliActive && course.subject !== "English"
      ? course["title-bn"]
      : course.title;

  const courseDescription =
    bengaliActive && course.subject !== "English"
      ? course["description-bn"]
      : course.description;

  return (
    <div className="course-details">
      <div className="details-header">
        <h1>{courseTitle.toUpperCase()}</h1>
      </div>

      <div className="course-meta">
        <p className="class-box">Class: {localStorage.getItem("class")}</p>
        <p className="subject-box">
          {course.subject}
          <button
            onClick={speakCourseDetails}
            className={`play-sound-btn ${isSpeaking ? "active" : ""}`}
            title={isSpeaking ? "Stop" : "Play"}
          >
            <FaVolumeUp size={18} />
          </button>
        </p>
      </div>

      <div className="subtitle">{translations[lang].desc}</div>

      <div className="course-content">
        <div className="description">
          <img src={imageUrl} alt={course.subject} className="course-image" />
          <p>{courseDescription || "No description available."}</p>
        </div>

        <div className="action-checklist">
          <div
            className={`check-item ${articlesRead ? "checked" : ""}`}
            onClick={() => handleEnrollNow("courseArticle")}
          >
            {translations[lang].read_article_box}
          </div>
          <div
            className={`check-item ${flashcardsRead ? "checked" : ""}`}
            onClick={() => handleEnrollNow("flashcards")}
          >
            {translations[lang].read_flashcards_box}
          </div>
          <div
            className={`check-item ${QuizRead ? "checked" : ""}`}
            onClick={() => handleEnrollNow("quiz")}
          >
            {translations[lang].read_quiz_box}
          </div>
        </div>

        <hr className="divider" />

        <div className="action-buttons">
          <button
            className="action-box"
            onClick={handlePastQuiz}
            disabled={!QuizRead}
            style={{
              opacity: QuizRead ? 1 : 0.6,
              cursor: QuizRead ? "pointer" : "not-allowed",
            }}
          >
            {translations[lang].see_past_quizzes_box}
          </button>
          <button className="action-box" onClick={handleDownloadPDF}>
            {translations[lang].download_pdf_box}
          </button>
          <button className="action-box">
            {translations[lang].join_discussion_box}
          </button>
        </div>
      </div>

      <div className="buttons">
        <button className="all-courses-btn" onClick={handleAllCourses}>
          <FaArrowLeft style={{ marginRight: "8px" }} />
          {translations[lang].all_courses}
        </button>
        <button className="share-btn" onClick={handleShare}>
          <FaShareAlt style={{ marginRight: "8px" }} />
          {translations[lang].share_course}
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
