# Srabon

**An inclusive, gamified learning web app for secondary schoolers that personalizes science education through storytelling, quizzes, and AI-generated courses with multilingual and accessibility support.**

![Srabon Banner](https://raw.githubusercontent.com/SrotDev/Srabon/refs/heads/main/public/assets/images/logo.png) 

## 🌟 Features

- **Personalized Learning Paths**: Tailor-made science courses generated using AI to suit individual learning paces and styles.
- **Gamified Experience**: Engaging storytelling combined with interactive quizzes to make learning fun and effective.
- **Multilingual Support**: Accessible in multiple languages to cater to a diverse student base.
- **Accessibility Focused**: Designed with accessibility in mind to support learners with different needs.
- **Responsive Design**: Optimized for various devices, ensuring a seamless experience across desktops, tablets, and smartphones.

## 🚀 Live Demo

Experience Srabon in action: [https://srotdev.github.io/Srabon/](https://srotdev.github.io/Srabon/)


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
    - @mediapipe/hands
    - @tensorflow-models/hand-pose-detection
    - @tensorflow/tfjs-backend-webgl
    - @tensorflow/tfjs-core
    
- **Backend**:
  - Django 5.2.1 (core framework)
  - Django REST Framework 3.16.0 (API layer)
  - Djoser + SimpleJWT (authentication)
  - Django-CORS-Headers (CORS support)
- **AI & APIs**:
  - Google Gemini LLM APIs (generative AI support)
  - google-generativeai, google-genai, google-ai-generativelanguage
  - google-auth and Google API Client libraries
  - Unsplash API (for illustrations)
  - ChatGPT (for content generation)
  - Responsive Voice API (for text to speech)
- **Database**:
  - MongoDB (NoSQL database)
  - PostgreSQL (SQL database)
- **Version Control & Hosting**:
  - GitHub (repository management)
  - GitHub Pages (hosting the frontend)
  - Render (hosting the Django backend)



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

📄 License
[Specify the license under which the project is distributed.]

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a new branch:

bash
Copy
Edit
git checkout -b feature/YourFeature
Commit your changes:

bash
Copy
Edit
git commit -m 'Add YourFeature'
Push to the branch:

bash
Copy
Edit
git push origin feature/YourFeature
Open a pull request

Please ensure your code adheres to the project's coding standards and passes all tests.

📫 Contact
For any inquiries or feedback:

GitHub: SrotDev

Email: [srot.dev@gmail.com]