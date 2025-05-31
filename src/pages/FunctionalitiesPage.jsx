import { useEffect, useState, useContext } from 'react';
import CreateCourseCard from '../components/CreateCourseCard';
import SelectedSubjectsCard from '../components/SelectedSubjectsCard';
import AskAiCard from '../components/AskAiCard';
import botImg from '../assets/images/bot.png';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const FunctionalitiesPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [name, setName] = useState(localStorage.getItem("name") || "Student");
  const [subjects, setSubjects] = useState(
    JSON.parse(localStorage.getItem("subjects")) || ["Physics", "Chemistry", "Biology"]
  );
  const [studentClass, setStudentClass] = useState(localStorage.getItem("class") || "Unknown");

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/studentinfo/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();

          // Save data to localStorage
          localStorage.setItem("name", data.name || "Student");
          localStorage.setItem("class", data.class || "Unknown");
          localStorage.setItem("subjects", JSON.stringify(data.subjects || ["Physics", "Chemistry", "Biology"]));

          // Update state
          setName(data.name || "Student");
          setSubjects(data.subjects || ["Physics", "Chemistry", "Biology"]);
          setStudentClass(data.class || "Unknown");
        } else {
          console.error("Failed to fetch student info:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };

    fetchStudentInfo();
  }, []); // Runs only once after initial render

  return (
    <div className="functionalities">
      <div className="main-content">
        <div className="left-panel">
          <div className="greeting-box">
            <img src={botImg} alt="Bot" className="bot-image" />
            <div className="greeting-text">
              <h2>{translations[lang].greeting_title}{name}!</h2>
              <p>{translations[lang].greeting_body}</p>
            </div>
          </div>
          <CreateCourseCard />
        </div>
        <div className="right-panel">
          <SelectedSubjectsCard subjects={subjects} />
          <AskAiCard />
        </div>
      </div>
    </div>
  );
};

export default FunctionalitiesPage;
