import CourseList from "../components/CourseList";

const CoursesPage = () => {
  return (
    <div className="courses-page">
      <section className="header">
        <h1>Grow up your skills</h1>
        <p>with our courses</p>
      </section>
      <CourseList />
    </div>
  );
};

export default CoursesPage;