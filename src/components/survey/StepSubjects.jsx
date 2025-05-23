const subjects = [
  "Physics", "Chemistry", "Math", "History",
  "Economics", "Biology", "Agriculture", "English"
];

const StepSubjects = ({ selectedSubjects, setSelectedSubjects }) => {
  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="survey-step">
      <h2>Alright! Which subjects are you studying?</h2>
      <div className="subject-grid">
        {subjects.map((sub) => (
          <label key={sub} className="subject-tile">
            <input
              type="checkbox"
              checked={selectedSubjects.includes(sub)}
              onChange={() => toggleSubject(sub)}
            />
            {sub}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepSubjects;
