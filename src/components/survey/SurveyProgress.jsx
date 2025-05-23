const SurveyProgress = ({ step }) => (
  <div className="progress-indicator">
    {[0, 1, 2, 3].map((i) => (
      <span key={i} className={i <= step ? "dot active" : "dot"} />
    ))}
  </div>
);

export default SurveyProgress;
