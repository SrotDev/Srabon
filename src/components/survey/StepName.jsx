const StepName = ({ name, setName }) => (
  <div className="survey-step">
    <h2>Let’s get started... What’s your name?</h2>
    <input
      type="text"
      placeholder="Enter your name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="survey-input"
    />
  </div>
);

export default StepName;
