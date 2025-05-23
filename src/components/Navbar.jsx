import React from 'react';
import logo from '../assets/images/logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isIndexPage = ((location.pathname === "/") || (location.pathname === "/auth"));

  const handleProtectedClick = (e) => {
    if (isIndexPage) {
      e.preventDefault();
      toast.warning("You need to login first.");
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
          <NavLink to="/"><img src={logo} alt="Srabon Logo" className="srabon" style={{ height: '50px' }} /></NavLink>
        </div>
        <ul className="navbar__links">
          <li><NavLink to="/functionalities" onClick={handleProtectedClick} className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/courses" onClick={handleProtectedClick} className={({ isActive }) => isActive ? "active" : ""}>Courses</NavLink></li>
          {/* <li><NavLink to="/explore" onClick={handleProtectedClick} className={({ isActive }) => isActive ? "active" : ""}>Explore</NavLink></li> */}
          <li><NavLink to="/chats" onClick={handleProtectedClick} className={({ isActive }) => isActive ? "active" : ""}>Chat</NavLink></li>
          {!isIndexPage && (
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
