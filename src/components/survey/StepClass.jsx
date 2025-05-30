import { useContext } from 'react';
import { LanguageContext } from '../../LanguageContext';
import translations from '../../translations.jsx';

const StepClass = ({ selectedClass, setSelectedClass }) => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  
  const classes = [6, 7, 8, 9, 10];
  
  return (
    <div className="survey-step">
      <h2>{ translations[lang].ask_class }</h2>
      <div className="survey-options">
        {classes.map((cls) => (
          <button
            key={cls}
            className={`circle-btn ${selectedClass === cls ? "active" : ""}`}
            onClick={() => setSelectedClass(cls)}
          >
            {cls}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepClass;
