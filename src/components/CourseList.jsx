import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader"; // ✅ Spinner

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://srabonbackend3.onrender.com/api/courses/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const parsed = data.map((c) => ({
          name: c.name,
          title: c.parent?.title,
          subtitle: c.parent?.subtitle,
          subject: c.parent?.subject,
        }));
        setCourses(parsed);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false); // ✅ Hide spinner
      }
    };
    fetchCourses();
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % courses.length);
  const prev = () => setIndex((prev) => (prev - 1 + courses.length) % courses.length);
  const visibleCourses = courses.slice(index, index + 3);

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="course-slider">
      <button onClick={prev} className="nav-btn">
        <FaArrowLeft size={24} color="#fff" />
      </button>

      <div className="course-cards">
        {visibleCourses.map((course, i) => (
          <CourseCard key={i} course={course} />
        ))}
      </div>

      <button onClick={next} className="nav-btn">
        <FaArrowRight size={24} color="#fff" />
      </button>
    </div>
  );
};

export default CourseList;
