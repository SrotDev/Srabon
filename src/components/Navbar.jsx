import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.png';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isIndexPage = ((location.pathname === "/") || (location.pathname === "/auth"));

  const { bengaliActive, toggleLanguage } = useContext(LanguageContext);
  const lang = bengaliActive ? 'bn' : 'en';

  const handleProtectedClick = (e) => {
    if (isIndexPage) {
      e.preventDefault();
      toast.warning(translations[lang].nav_toast);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <NavLink to="/"><img src={logo} alt="Srabon Logo" style={{ height: '50px' }} /></NavLink>
        </div>
        <ul className="navbar__links">
          <li><NavLink to="/functionalities" onClick={handleProtectedClick}>{translations[lang].nav_home}</NavLink></li>
          <li><NavLink to="/courses" onClick={handleProtectedClick}>{translations[lang].nav_courses}</NavLink></li>
          <li><NavLink to="/chats" onClick={handleProtectedClick}>{translations[lang].nav_chat}</NavLink></li>
          {!isIndexPage && (
            <li><button className="logout-btn" onClick={handleLogout}>{translations[lang].nav_logout}</button></li>
          )}
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem' }}>EN</span>
              <label className="toggle-lang-switch">
                <input type="checkbox" checked={bengaliActive} onChange={toggleLanguage} />
                <span className="slider"></span>
              </label>
              <span style={{ fontSize: '0.9rem' }}>BN</span>
            </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
