import React, { useContext } from 'react';
import studentImage from '../assets/images/student.png';
import { NavLink } from 'react-router-dom';
import translations from '../translations.jsx';
import { LanguageContext } from '../LanguageContext';

const Hero = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';

  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1>{translations[lang].hero_title_1}<br />{translations[lang].hero_title_2}</h1>
          <p>{translations[lang].hero_body}</p>
          <div className="hero__buttons">
            <NavLink to="/auth">
              <button className="btn btn--primary">{translations[lang].hero_btn_start}</button>
            </NavLink>
            <NavLink to="https://www.facebook.com/srot.dev" target='_blank'>
              <button className="btn btn--secondary">{translations[lang].hero_btn_learn}</button>
            </NavLink>
          </div>
        </div>
        <div className="hero__image">
          <img src={studentImage} alt="Student" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
