import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <Outlet />
      <ToastContainer position="top-right" />
      <Footer />
    </div>
  );
};

export default MainLayout;
