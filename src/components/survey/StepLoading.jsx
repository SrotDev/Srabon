import { useContext } from 'react';
import { LanguageContext } from '../../LanguageContext';
import translations from '../../translations.jsx';

const StepLoading = ({ name }) => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';

  return (
    <div className="survey-step">
      <h2>{ translations[lang].wonderful }{name || "Student"}!</h2>
      <p>{ translations[lang].setup }</p>
      <div className="spinner"></div>
    </div>
  );
};

export default StepLoading;
