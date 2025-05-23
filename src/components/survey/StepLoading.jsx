const StepLoading = ({ name }) => (
  <div className="survey-step">
    <h2>Wonderful, {name || "Student"}!</h2>
    <p>I’m setting up your profile as we speak…</p>
    <div className="spinner"></div>
  </div>
);

export default StepLoading;
