# Srabon

**An inclusive, gamified learning web app for secondary schoolers that personalizes science education through storytelling, quizzes, and AI-generated courses with multilingual and accessibility support.**

![Srabon Banner](banner.jpg) 

<br>

## 🌟 Features

- **Personalized Learning Paths**:  
  Right from the start, Srabon tailors a unique learning journey for each student. After a quick personalization survey (name, class, subject selection), the AI creates customized courses, study plans, and quizzes that adapt to each learner’s pace, needs, and goals.

- **Gamified Experience**:  
  Learning becomes an adventure! Interactive storytelling, dynamic quizzes, and engaging flashcards transform study time into a fun and immersive experience. This gamified approach keeps students motivated and invested in their learning.

- **Multilingual Support**:  
  Srabon caters to a diverse audience by offering content in multiple languages, including plans to fully integrate native Bangla with localized scientific terms. This ensures that no learner is left behind because of language barriers.

- **Accessibility Focused**:  
  Inclusivity is at the heart of Srabon. With planned features like voice commands, screen reader support, and haptic feedback, the platform aims to provide an equal learning experience for all students, including those with visual or motor impairments.

- **Responsive Design**:  
  No matter the device—desktop, tablet, or smartphone—Srabon ensures a seamless, visually appealing experience. The clean and intuitive interface is designed with young learners in mind, making it easy for anyone to navigate.

- **Instant AI-Powered Doubt Resolution**:  
  Srabon’s conversational AI (powered by Gemini AI) is always on standby to answer any question, rephrase explanations, or create new learning materials instantly—bridging the gap of delayed doubt resolution in traditional self-learning environments.

- **Save & Share Learning Materials**:  
  Students can save their generated content, quizzes, and flashcards for future review. They can also share these materials with peers or educators, fostering collaboration and continuous learning.

- **Progress Tracking & Insights**:  
  Every quiz attempt and learning session is tracked in real-time, giving students (and potentially teachers or parents) a clear view of progress, strengths, and areas to improve.

- **Scalability & Future Features**:  
  Built to grow! The platform is designed to handle thousands of students, with plans to integrate PDF analyzers (converting notes to quizzes), offline PDF generators, and more—making Srabon future-ready for educational transformation.



<br>

## 🚀 Live Demo
Experience Srabon in action: [https://srotdev.github.io/Srabon/](https://srotdev.github.io/Srabon/)


<br>

## 🛠️ Tech Stack
- **Frontend**:
  - React.js (Vite for fast bundling)
  - Bootstrap, Sass, CSS3 for styling
  - JavaScript (ES6+)
  - Libraries:
    - React Router DOM (client-side routing)
    - React Toastify (toast notifications)
    - React Icons (icon library)
    - React Spinners (loading spinners)
    - Marked (markdown rendering)
- **Backend**:
  - Django 5.2.1 (core framework)
  - Django REST Framework 3.16.0 (API layer)
  - Djoser + SimpleJWT (authentication)
  - Django-CORS-Headers (CORS support)
  - Flask
- **AI & APIs**:
  - Google Gemini LLM APIs (generative AI support)
  - google-generativeai, google-genai, google-ai-generativelanguage
  - google-auth and Google API Client libraries
  - Unsplash API (for illustrations)
  - Responsive Voice API (for text to speech)
  - ChatGPT (for content generation)
- **Database**:
  - MongoDB (NoSQL database)
  - PostgreSQL (SQL database)
- **Version Control & Hosting**:
  - GitHub (repository management)
  - GitHub Pages (hosting the frontend)
  - Render (hosting the Django backend)


<br>

## 📁 Project Structure

```
Srabon/
├── public/ # Static assets
├── src/ # Source code
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── assets/ # Images and other assets
│ ├── App.jsx # Root component
│ └── main.jsx # Entry point
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── index.html # HTML template
├── package.json # Project metadata and dependencies
├── vite.config.js # Vite configuration
└── README.md # Project overview
```


<br>

## 📦 Installation

To set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SrotDev/Srabon.git
   cd Srabon
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```


3. **Run the development server:**
    ``` bash
    npm run dev
    ```

The application will be available at http://localhost:5173/ by default.

<br>


## 📄 License
🚫 **IMPORTANT NOTICE: NO COMMERCIAL USE** 🚫

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

- ✅ You are welcome to use it for learning, personal projects, and non-commercial collaboration.  
- ❌ You **may not** use this project (or any modified versions) for commercial gain, competitions, or any monetary benefit **without explicit written permission**.

Any violations will be considered **copyright infringement** and may lead to legal action.

For questions or commercial licensing, please contact [SrotDev](https://github.com/SrotDev/Srabon).


<br>

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

- Fork this repository: [https://github.com/SrotDev/Srabon/fork](https://github.com/SrotDev/Srabon/fork)

- Create a new branch for your feature or fix:
  ```bash
  git checkout -b feature/YourFeature
  ```

- Commit your changes with a clear message:
  ```bash
  git commit -m "Add YourFeature"
  ```

- Push your branch to your forked repository:
  ```bash
  git push origin feature/YourFeature
  ```

- Open a pull request (PR)  and describe your changes: [https://github.com/SrotDev/Srabon/pulls](https://github.com/SrotDev/Srabon/pulls)

- Found a bug or have a feature request? Create an issue here: [https://github.com/SrotDev/Srabon/issues](https://github.com/SrotDev/Srabon/issues)

**Important:**  
✅ Please ensure your code adheres to the project's coding standards.  
✅ Make sure all tests pass before submitting your PR.

We appreciate your help to make this project better! 🚀


<br>

## 📫 Contact
For any inquiries or feedback:
- **GitHub**: [SrotDev](https://github.com/SrotDev)
- **Email**: [srot.dev@gmail.com](mailto:srot.dev@gmail.com)
- **Facebook**: [@স্রোত.dev](https://www.facebook.com/srot.dev)