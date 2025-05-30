import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from "../assets/images/404.svg";
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const NotFoundPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <img
          src={notFoundImage}
          alt="Lost Robot"
          className="not-found-img"
        />
        <h1>{translations[lang].not_found_title}</h1>
        <p>
          {translations[lang].not_found_body}
        </p>
        <button onClick={() => navigate('/functionalities')} className="home-btn">
            {translations[lang].home_btn}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
