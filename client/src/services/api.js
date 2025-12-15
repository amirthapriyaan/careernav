
import axios from "axios";


const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://careernav.onrender.com/api"),
  timeout: 30000,
});





export async function analyzeMatch(jobDescription, resumeText) {
  const res = await api.post("/match/analyze", { jobDescription, resumeText });
  return res.data;
}

export async function getInterviewQuestions(jobDescription, resumeText) {
  const res = await api.post("/match/interview-questions", { jobDescription, resumeText });
  return res.data;
}

export async function getATSHint(jobDescription, resumeText) {
  const res = await api.post("/match/ats-hint", { jobDescription, resumeText });
  return res.data;
}

export async function askCareerQuestion(message) {
  const res = await api.post("/chat/ask", { message });
  return res.data;
}

export async function uploadPdfFile(file) {
  const form = new FormData();
  form.append("file", file); 
  const res = await api.post("/upload/pdf", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60_000,
  });
  return res.data;
}
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export async function analyzeJD(jobDescription) {
  const res = await api.post('/match/analyze-jd', { jobDescription });
  return res.data;
}

// Upload resume
export async function uploadResumeFile(file) {
  const form = new FormData();
  form.append("file", file);
  
  const res = await api.post("/upload/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },

    timeout: 60_000,
  });
  return res.data;
  
}
export default api;
