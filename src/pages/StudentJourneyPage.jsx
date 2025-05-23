import { useState, useEffect } from "react";
import StepName from "../components/survey/StepName";
import StepClass from "../components/survey/StepClass";
import StepSubjects from "../components/survey/StepSubjects";
import StepLoading from "../components/survey/StepLoading";
import SurveyProgress from "../components/survey/SurveyProgress";
import { useNavigate } from "react-router-dom";


const StudentJourneyPage = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
  if (step === 3) {
    const timer = setTimeout(async () => {
      try {
        // 1. Submit student info
        const res = await fetch("https://srabonbackend3.onrender.com/api/studentinfo/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            class: studentClass,
          }),
        });

        if (!res.ok) throw new Error("Failed to submit student info");

        // 2. Store data locally
        localStorage.setItem("name", name);
        localStorage.setItem("class", studentClass);
        localStorage.setItem("subjects", JSON.stringify(subjects));

        // 3. Define subject → courses map
        const subjectTitles = {
          Physics: ["Physics - Fundamentals", "Physics - Advanced Concepts"],
          Chemistry: ["Intro to Chemistry", "Advanced Chemistry Techniques"],
          Math: ["Mathematics - Basics", "Advanced Calculus"],
          History: ["World History - Overview", "Modern History"],
          Economics: ["Microeconomics", "Macroeconomics Principles"],
          Biology: ["Intro to Biology", "Genetics and Evolution"],
          Agriculture: ["Agriculture 101", "Sustainable Farming Techniques"],
          English: ["English Literature", "Advanced English Grammar"],
        };

        // 4. Submit courses one by one
        for (const subject of subjects) {
          const courseTitles = subjectTitles[subject] || [];
          for (const title of courseTitles) {
            const courseRes = await fetch("https://srabonbackend3.onrender.com/api/addcourses/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                subject,
                title,
              }),
            });

            if (!courseRes.ok) {
              const error = await courseRes.text();
              throw new Error(`❌ Failed to add course: ${title} — ${error}`);
            }

            console.log(`✅ Course "${title}" for ${subject} added.`);
          }
        }

        // 5. Navigate after all done
        navigate("/courses");
      } catch (err) {
        console.error("❌ Error during course setup:", err);
        navigate("/functionalities"); // You may keep user here or redirect to an error page
      }
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [step]);




  const goNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepName name={name} setName={setName} />;
      case 1:
        return <StepClass selectedClass={studentClass} setSelectedClass={setStudentClass} />;
      case 2:
        return <StepSubjects selectedSubjects={subjects} setSelectedSubjects={setSubjects} />;
      case 3:
        return <StepLoading name={name} />;
      default:
        return null;
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-nav">
        <button onClick={goBack} className="nav-btn">←</button>
        <SurveyProgress step={step} />
        <button onClick={goNext} className="nav-btn">→</button>
      </div>
      {renderStep()}
    </div>
  );
};

export default StudentJourneyPage;
