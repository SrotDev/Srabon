import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { useState } from "react";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginSignupPage from "./pages/LoginSignupPage";
import StudentJourneyPage from "./pages/StudentJourneyPage";
import CoursesPage from "./pages/CoursesPage";
import ExplorePage from "./pages/ExplorePage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CourseArticlePage from "./pages/CourseArticlePage";
import FunctionalitiesPage from "./pages/FunctionalitiesPage";
import FlashcardsPage from "./pages/FlashcardsPages";
import QuizPage from "./pages/QuizPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [course, setCourse] = useState(null);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/auth" element={<LoginSignupPage />} />
        <Route path="/journey" element={<StudentJourneyPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/chats" element={<ChatPage />} />
        
        <Route
          path="/courses/:name"
          element={<CourseDetailsPage setCourse={setCourse} />} 
        />
        <Route
          path="/courseArticle/:name"
          element={<CourseArticlePage course={course} />}
        />
        <Route 
          path="/flashcards/:name" 
          element={<FlashcardsPage course={course} />} 
        />

        <Route 
          path="/quiz/:name" 
          element={<QuizPage />} 
        />



        <Route path="/functionalities" element={<FunctionalitiesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
