import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Add FaBars (hamburger icon)
import logo from "../assets/images/logo.png";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations.jsx";
import Notification from "./Notification"; // Import Notification component

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isIndexPage =
    location.pathname === "/" || location.pathname === "/auth";

  const { bengaliActive, toggleLanguage } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";

  const [showNotifications, setShowNotifications] = useState(false); // State for showing notifications
  const [isActive, setIsActive] = useState(false); // State for active/inactive notification button
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile hamburger menu

  const handleProtectedClick = (e) => {
    if (isIndexPage) {
      e.preventDefault();
      toast.warning(translations[lang].nav_toast);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to the home page after logout
  };

  const toggleNotification = () => {
    setIsActive(!isActive); // Toggle the active state
    setShowNotifications(!showNotifications); // Show/hide notifications
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div
          className="navbar__logo"
          onClick={() => navigate(isIndexPage ? "/" : "/functionalities")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Srabon Logo" style={{ height: "50px" }} />
        </div>

        {/* Regular Navbar Links */}
        <ul className={`navbar__links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/functionalities" onClick={handleProtectedClick}>
              {translations[lang].nav_home}
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" onClick={handleProtectedClick}>
              {translations[lang].nav_courses}
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" onClick={handleProtectedClick}>
              {translations[lang].nav_explore}
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" onClick={handleProtectedClick}>
              {translations[lang].nav_leaderboard}
            </NavLink>
          </li>
          {!isIndexPage && (
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                {translations[lang].nav_logout}
              </button>
            </li>
          )}
          <li className="lang-switcher">
            <span>EN</span>
            <label className="toggle-lang-switch">
              <input
                type="checkbox"
                checked={bengaliActive}
                onChange={toggleLanguage}
              />
              <span className="slider"></span>
            </label>
            <span>BN</span>
          </li>

          {/* Notifications Icon */}
          {!isIndexPage && (
            <li className="notification-btn">
              <div
                className={`icon-btn ${isActive ? "active" : "inactive"}`}
                onClick={toggleNotification} // Toggle active state on click
              >
                <FaBell size={25} />
              </div>
              {showNotifications && (
                <Notification
                  setShowNotifications={setShowNotifications} // Pass the state handler for closing
                  setIsActive={setIsActive} // Pass the state handler for setting inactive
                />
              )}
            </li>
          )}

          {/* User Profile Icon */}
          {!isIndexPage && (
            <li className="profile-btn">
              <div className="icon-btn" onClick={handleProfileClick}>
                <FaUserCircle size={25} />
              </div>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger Menu Button */}
        <div className="navbar__hamburger" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && <div className="overlay" onClick={toggleMobileMenu}></div>}
    </nav>
  );
};

export default Navbar;
