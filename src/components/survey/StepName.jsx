import { useContext } from 'react';
import { LanguageContext } from '../../LanguageContext';
import translations from '../../translations.jsx';

const StepName = ({ name, setName }) => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';

  return (
    <div className="survey-step">
      <h2>{ translations[lang].ask_name }</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="survey-input"
      />
    </div>
  );
};

export default StepName;
