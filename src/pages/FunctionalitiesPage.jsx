import CreateCourseCard from '../components/CreateCourseCard';
import SelectedSubjectsCard from '../components/SelectedSubjectsCard';
import AskAiCard from '../components/AskAiCard';
import botImg from '../assets/images/bot.png';

const FunctionalitiesPage = () => {
  const name = localStorage.getItem("name") || "Student";
  const selectedSubjects = JSON.parse(localStorage.getItem("subjects")) || ["Physics", "Chemistry", "Biology"];

  return (
    <div className="functionalities">
      <div className="main-content">
        <div className="left-panel">
          <div className="greeting-box">
            <img src={botImg} alt="Bot" className="bot-image" />
            <div className="greeting-text">
              <h2>Hey {name}!</h2>
              <p>What would you like to do today?</p>
            </div>
          </div>
          <CreateCourseCard />
        </div>
        <div className="right-panel">
          <SelectedSubjectsCard subjects={selectedSubjects} />
          <AskAiCard />
        </div>
      </div>
    </div>
  );
};

export default FunctionalitiesPage;
