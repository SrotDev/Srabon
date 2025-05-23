const AuthInput = ({ label, type = "text", value, onChange, name }) => {
  return (
    <div className="auth-input">
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        name={name}
        required
      />
    </div>
  );
};

export default AuthInput;
