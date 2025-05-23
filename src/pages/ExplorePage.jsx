import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';

const allCourses = [
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Physics',
    title: 'BM Data Science Professional Certificate',
    description: 'Product Management Masterclass, you will learn with Sarah Johnson.',
    image: 'https://source.unsplash.com/featured/?physics,science',
  },
  {
    subject: 'Chemistry',
    title: 'The Science of Well-Being',
    description: 'A wellness course to understand mental health and happiness.',
    image: 'https://source.unsplash.com/featured/?chemistry,lab',
  },
  {
    subject: 'Math',
    title: 'Python for Everybody',
    description: 'Learn how to program with Python and solve real-world problems.',
    image: 'https://source.unsplash.com/featured/?math,python',
  },
  {
    subject: 'Biology',
    title: 'Introduction to Biology',
    description: 'This course helps understand the basics of cells, genes, and evolution.',
    image: 'https://source.unsplash.com/featured/?biology,cell',
  },
];

const subjects = ['Physics', 'Chemistry', 'Biology', 'Math'];

const ExplorePage = () => {
  const [selectedSubject, setSelectedSubject] = useState('Physics');

  const filteredCourses = allCourses.filter(
    (course) => course.subject === selectedSubject
  );

  return (
  <div className="explore-page">
    <div className="explore-container">
      <h2 className="explore-title">EXPLORE</h2>

      <div className="explore-filters">
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="explore-grid">
        {filteredCourses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  </div>

  );
};

export default ExplorePage;
