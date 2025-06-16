import { useState, useContext } from "react";
import AuthInput from "./AuthInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations.jsx";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ Spinner
import { createPortal } from "react-dom";

const AuthForm = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // ✅ New loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createNotification = async (message) => {
    // Send a POST request to create the notification with the token in Authorization header
    const notificationPayload = { message };
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Unable to create notification.");
      return;
    }

    try {
      await fetch(`${apiBaseUrl}/notifications/make/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use token for authentication
        },
        body: JSON.stringify(notificationPayload),
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  const handleContinueClick = async () => {
    const apiUrl = isLogin ? `${apiBaseUrl}/login/` : `${apiBaseUrl}/register/`;

    const payload = isLogin
      ? {
          username: form.username,
          password: form.password,
        }
      : {
          username: form.username,
          password: form.password,
          email: form.email,
        };

    try {
      setLoading(true); // ✅ Show spinner
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data.detail ||
          Object.values(data).flat().join(" ") ||
          "Something went wrong.";
        throw new Error(errorMessage);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log(data.token);
      }

      // Trigger notification
      await createNotification(
        `${isLogin ? translations[lang].login : translations[lang].signup} ${
          translations[lang].successful
        }`
      );

      toast.success(
        `${isLogin ? translations[lang].login : translations[lang].signup} ${
          translations[lang].successful
        }`
      );
      navigate(isLogin ? "/functionalities" : "/journey");
    } catch (err) {
      toast.error(`❌ ${err.message}`);
      console.error(
        `❌ ${isLogin ? translations[lang].login : translations[lang].signup} ${
          translations[lang].failed
        }:`,
        err
      );
    } finally {
      setLoading(false); // ✅ Hide spinner
    }
  };

  if (loading) {
    // ✅ Show spinner instead of form while loading
    return createPortal(
      <div
        className="spinner-container"
      >
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>,
      document.body // ✅ target container for portal
    );
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          {translations[lang].login}
        </button>
        <span className="removable">|</span>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          {translations[lang].signup}
        </button>
      </div>

      <div className="form-fields">
        <AuthInput
          label={translations[lang].username}
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
        />

        {!isLogin && (
          <AuthInput
            label={translations[lang].email}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        )}

        <AuthInput
          label={translations[lang].password}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="auth-btn"
          type="button"
          onClick={handleContinueClick}
        >
          {translations[lang].continue}
        </button>

        <p className="auth-link">
          {isLogin ? (
            <>
              {translations[lang].no_account}{" "}
              <span onClick={() => setIsLogin(false)}>
                {translations[lang].auth_link_register}
              </span>
            </>
          ) : (
            <>
              {translations[lang].yes_account}{" "}
              <span onClick={() => setIsLogin(true)}>
                {translations[lang].auth_link_login}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="auth-footer">
        <h2>
          {isLogin ? translations[lang].welcome : translations[lang].nice}
        </h2>
        <p>{isLogin ? translations[lang].login : translations[lang].signup}</p>
      </div>
    </div>
  );
};

export default AuthForm;
