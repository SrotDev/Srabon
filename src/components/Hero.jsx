import React from 'react';
import studentImage from '../assets/images/student.png';
import { NavLink } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1>Start learning<br />with us now.</h1>
          <p>An inclusive, gamified learning web app for secondary schoolers that personalizes science education through storytelling, quizzes, and AI-generated courses with multilingual and accessibility support.</p>
          <div className="hero__buttons">
            <NavLink to="/auth" > <button className="btn btn--primary">Get Started</button> </NavLink>
            <NavLink to="https://www.facebook.com/srot.dev" target='_blank'><button className="btn btn--secondary">Learn More</button> </NavLink>
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
