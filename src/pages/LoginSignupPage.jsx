import React from "react";
import AuthForm from "../components/AuthForm";
import authImg from "../assets/images/auth.svg"; // use background image

const LoginSignupPage = () => {
  return (
    <div className="login-signup-page">
      <div className="auth-left">
        <img src={authImg} alt="auth" />
      </div>
      <div className="auth-right">
        <AuthForm />
      </div>
    </div>
  );
};

export default LoginSignupPage;
