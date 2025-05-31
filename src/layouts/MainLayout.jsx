import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CameraWithGestures from '../CameraWithGestures'; // 👈 Updated import!

const MainLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <Outlet />
      <ToastContainer position="top-right" />
      <Footer />

      {/* Add CameraWithGestures to handle camera + gestures globally */}
      {/* <CameraWithGestures /> */}
    </div>
  );
};

export default MainLayout;
