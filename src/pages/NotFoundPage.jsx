import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImage from "../assets/images/404.svg";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <img
          src={notFoundImage}
          alt="Lost Robot"
          className="not-found-img"
        />
        <h1>Oops! Page Not Found</h1>
        <p>
          It seems you've taken a wrong turn. But don't worry, we'll help you
          get back on track!
        </p>
        <button onClick={() => navigate('/functionalities')} className="home-btn">
            Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
