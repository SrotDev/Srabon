const StepClass = ({ selectedClass, setSelectedClass }) => {
  const classes = [6, 7, 8, 9, 10];

  return (
    <div className="survey-step">
      <h2>Tell me about your current class</h2>
      <div className="survey-options">
        {classes.map((cls) => (
          <button
            key={cls}
            className={`circle-btn ${selectedClass === cls ? "active" : ""}`}
            onClick={() => setSelectedClass(cls)}
          >
            {cls}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepClass;
