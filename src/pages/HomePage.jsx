import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ClipLoader from 'react-spinners/ClipLoader'; // ✅ Spinner

const HomePage = () => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let intervalId;

    const checkApi = async () => {
      try {
        const response = await fetch('https://srabonbackend3.onrender.com/api/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log('API Response:', jsonData);
        setData(jsonData);

        if (jsonData.ready === true) {
          setReady(true);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error fetching API:', error);
      }
    };

    // Initial call
    checkApi();

    // Set interval for every 10 seconds
    intervalId = setInterval(checkApi, 10000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  if (!ready) {
    // Show spinner while waiting
    return (
      <div className="spinner-container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <ClipLoader color="#27d887" loading={true} size={50} />
        <p style={{ marginTop: '20px' }}>Checking API status every 10 seconds...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <Hero />
      <div>
        <p>API is ready!</p>
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
