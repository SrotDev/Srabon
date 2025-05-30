import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ Spinner

const HomePage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiSecondUrl = import.meta.env.VITE_API_SECOND_URL;
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let intervalId;

    const checkApi = async () => {
      try {
        // Fetch from apiBaseUrl
        const response = await fetch(
          `${apiBaseUrl}/getserverinfo/?nocache=${Date.now()}`,
          {
            method: "GET",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Base API HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("API Response (Base):", jsonData);
        setData(jsonData);

        if (jsonData.ready === "True") {
          setReady(true);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching Base API:", error);
      }

      // Separate second fetch so it runs **regardless** of first one’s success
      try {
        const secondResponse = await fetch(
          `${apiSecondUrl}/?nocache=${Date.now()}`,
          {
            method: "GET",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
            },
          }
        );

        if (!secondResponse.ok) {
          console.error(
            `Second API HTTP error! Status: ${secondResponse.status}`
          );
        } else {
          console.log("Second API ok!");
          const secondData = await secondResponse.json();
          console.log("API Response (Second):", secondData);
        }
      } catch (error) {
        console.error("Error fetching Second API:", error);
      }
    };

    // Initial call
    checkApi();

    // Set interval for every 20 seconds
    intervalId = setInterval(checkApi, 20000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  if (!ready) {
    // Show spinner while waiting
    return (
      <div
        className="spinner-container"
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="home">
      <Hero />
    </div>
  );
};

export default HomePage;
