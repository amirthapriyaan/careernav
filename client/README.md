# 🎯 Career Compass – Job & Career Assistant

## 📌 Overview

**Career Compass** is an AI-powered job and career assistant designed to help college students evaluate their readiness for specific job roles and receive actionable guidance to strengthen their applications.

Students often struggle to understand whether they qualify for a role and what skills they are missing. This application bridges that gap by analyzing job descriptions and resumes using generative AI, providing match scores, gap analysis, and personalized recommendations.

This project is developed as a **Proof-of-Concept (POC)** to demonstrate the ability to learn, design, and build an AI-assisted application.

---

## 🚀 Key Features

- 📄 **Job Description & Resume Analysis**
  - Paste a job description
  - Upload or paste resume text (PDF supported)

- 📊 **Job Match Scoring**
  - Visual readiness score (e.g., *Strong Match – 8/10*)
  - Clear indication of overall fit

- 🧠 **Skill Gap Analysis**
  - Identifies missing or weak skills
  - Highlights strengths already present in the resume

- 🎯 **Actionable Recommendations**
  - Provides one concrete, personalized improvement tip per analysis
  - Option to add missing skills directly to a learning roadmap

- 💬 **AI Career Q&A Chat**
  - Ask natural language questions such as:
    - *“Am I ready for frontend developer roles?”*
    - *“What skills should I learn for data science?”*

- 🗺️ **Personal Learning Roadmap**
  - Track skill gaps and learning progress
  - Visual progress indicators

---

## 🧠 AI & Conceptual Design

This application leverages **Generative AI** to perform reasoning over:

- Job descriptions
- Resume content
- User career-related queries

The system follows a **lightweight Retrieval-Augmented Generation (RAG)-style approach**, where relevant resume and job description context is injected into the AI prompt to generate accurate, personalized insights.

> **Note:** This POC focuses on prompt-based intelligence. The architecture can be extended to use vector embeddings and document retrieval systems (e.g., LangChain / LlamaIndex) for advanced semantic matching.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS (custom design system)
- Deployed on **Vercel**

### Backend
- Node.js
- Express.js
- OpenAI / LLM-based APIs
- Deployed on **Render**

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd server
3. Install dependencies:

   npm install
4. Create a .env file and add required variables:

    OPENAI_API_KEY=your_openai_key
    DATABASE_URL=your_database_url (if applicable)
5. Start the backend server:

    npm start


    The backend will run by default at:

    http://localhost:5000
🔹 Frontend Setup

1. Navigate to the frontend directory:

cd client


2. Install dependencies:

npm install


3. Run the application locally:

npm start


4. OR build for production:

npm run build

🌍 Environment Variables
1. Frontend (Vercel)

Set the following environment variable in Vercel Dashboard → Project Settings → Environment Variables:

REACT_APP_API_URL=https://careernav.onrender.com/api


2. Apply the variable to Production, Preview, and Development environments, then redeploy the project.