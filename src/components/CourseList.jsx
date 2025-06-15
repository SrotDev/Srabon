import { useEffect, useState, useContext } from "react";
import CourseCard from "./CourseCard";
import ClipLoader from "react-spinners/ClipLoader";
import { LanguageContext } from "../LanguageContext";
import { FaSearch } from "react-icons/fa";

const CourseList = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterOption, setFilterOption] = useState("All"); // Single filter for both subject and author
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/courses/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const parsed = data.map((c) => ({
          courseID: c.courseID,
          subject: c.parent?.subject,
          author_name: c.author_name, // Assuming author_name is in the response
          title: c.parent?.title,
          subtitle: c.parent?.subtitle,
          "title-bn": c.parent?.["title-bn"],
          "subtitle-bn": c.parent?.["subtitle-bn"],
        }));
        setCourses(parsed);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [apiBaseUrl]);

  const allSubjects = [
    "All",
    ...new Set(courses.map((c) => c.subject).filter(Boolean)),
  ];

  const allAuthors = [
    "All",
    ...new Set(courses.map((c) => c.author_name).filter(Boolean)),
  ];

  // Create combined filter options like "Subject: Physics" and "Author: John Doe"
  const combinedOptions = [
    "All",
    ...allSubjects.map((subject) => `Subject: ${subject}`),
    ...allAuthors.map((author) => `Author: ${author}`),
  ];

  const filtered = courses.filter((course) => {
    if (filterOption === "All") return true;

    // Check if it's a subject filter
    if (filterOption.startsWith("Subject:")) {
      const subject = filterOption.replace("Subject: ", "").trim();
      return course.subject === subject;
    }

    // Check if it's an author filter
    if (filterOption.startsWith("Author:")) {
      const author = filterOption.replace("Author: ", "").trim();
      return course.author_name === author;
    }

    return false;
  });

  const searched = filtered.filter((course) => {
    const title = bengaliActive ? course["title-bn"] : course.title;
    const subtitle = bengaliActive ? course["subtitle-bn"] : course.subtitle;
    const q = searchQuery.toLowerCase();

    return (
      title?.toLowerCase().includes(q) || subtitle?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(searched.length / coursesPerPage);
  const visibleCourses = searched.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="course-controls">
        <select
          value={filterOption}
          onChange={handleFilterChange}
          className="filter-dropdown"
        >
          {combinedOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={
              bengaliActive ? "কোর্স খুঁজুন..." : "Search courses..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
            className="course-search"
          />
        </div>
      </div>

      <div className="course-grid">
        {visibleCourses.map((course, i) => (
          <CourseCard key={i} course={course} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? "active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
