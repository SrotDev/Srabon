import CourseList from "../components/CourseList";
import { useContext } from "react";
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const CoursesPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  return (
    <div className="courses-page">
      <section className="header">
        <h1>{translations[lang].grow_skill_1}</h1>
        <p>{translations[lang].grow_skill_2}</p>
      </section>
      <CourseList />
    </div>
  );
};

export default CoursesPage;