import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations";
import { createPortal } from "react-dom";

const Leaderboard = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch the leaderboard data
        const leaderboardRes = await fetch(`${apiBaseUrl}/leaderboard/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const leaderboardData = await leaderboardRes.json();

        // 2️⃣ Fetch the current student's info
        const studentInfoRes = await fetch(`${apiBaseUrl}/studentinfo/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const studentInfoData = await studentInfoRes.json();
        const currentUser = studentInfoData.username;

        setLeaderboard(leaderboardData);
        setCurrentUsername(currentUser);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  if (loading) {
    return createPortal(
      <div className="spinner-container">
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>,
      document.body
    );
  }

  return (
    <div className="leaderboard-page">
      <h1 className="leaderboard-title">{translations[lang].leaderboard}</h1>

      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div>#</div>
          <div>Name</div>
          <div>Class</div>
          <div>Score</div>
        </div>
        {leaderboard.map((user, idx) => (
          <div
            key={user.username}
            className={`leaderboard-row ${
              user.username === currentUsername ? "highlight" : ""
            }`}
          >
            <div>{idx + 1}</div>
            <div>{user.name || user.username}</div>
            <div>{user.class}</div>
            <div>{user.score}</div>
          </div>
        ))}
      </div>

      <button
        className="home-btn"
        onClick={() => navigate("/functionalities/")}
      >
        <FaHome size={20} style={{ marginRight: "8px" }} />
        {translations[lang].go_to_home}
      </button>
    </div>
  );
};

export default Leaderboard;
