import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://careernav.onrender.com/api"),
  timeout: 30000,
});

/* Attach token automatically */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------- Job Match -------- */
export async function analyzeMatch(jobDescription, resumeText) {
  const res = await api.post("/match/analyze", { jobDescription, resumeText });
  return res.data;
}

export async function getInterviewQuestions(jobDescription, resumeText) {
  const res = await api.post("/match/interview-questions", {
    jobDescription,
    resumeText,
  });
  return res.data;
}

export async function getATSHint(jobDescription, resumeText) {
  const res = await api.post("/match/ats-hint", { jobDescription, resumeText });
  return res.data;
}

export async function analyzeJD(jobDescription) {
  const res = await api.post("/match/analyze-jd", { jobDescription });
  return res.data;
}

/* -------- Chat -------- */
export async function askCareerQuestion(message) {
  const res = await api.post("/chat/ask", { message });
  return res.data;
}

/* -------- Upload -------- */
export async function uploadPdfFile(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/upload/pdf", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });

  return res.data;
}

export async function uploadResumeFile(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/upload/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });

  return res.data;
}

export default api;
