import { useState } from "react";
import AuthInput from "./AuthInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinueClick = async () => {
  const apiUrl = isLogin
    ? "https://srabonbackend3.onrender.com/api/login/"
    : "https://srabonbackend3.onrender.com/api/register/";

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

    // ✅ Save token if available
    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log(data.token);
    }

    toast.success(`${isLogin ? "Login" : "Signup"} successful`);
    navigate(isLogin ? "/functionalities" : "/journey");
    
  } catch (err) {
    toast.error(`❌ ${err.message}`);
    console.error(`❌ ${isLogin ? "Login" : "Signup"} Failed:`, err);
  }
};


  return (
    <div className="auth-form-wrapper">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          LOGIN
        </button>
        <span>|</span>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          SIGN UP
        </button>
      </div>

      <div className="form-fields">
        <AuthInput
          label="Username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
        />

        {!isLogin && (
          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        )}

        <AuthInput
          label="Password"
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
          CONTINUE
        </button>

        <p className="auth-link">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsLogin(false)}>Register Now</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </>
          )}
        </p>
      </div>

      <div className="auth-footer">
        <h2>{isLogin ? "Welcome Back!" : "Nice to meet you :)"}</h2>
        <p>{isLogin ? "Please login to continue" : "Just sign up to join us"}</p>
      </div>
    </div>
  );
};

export default AuthForm;
