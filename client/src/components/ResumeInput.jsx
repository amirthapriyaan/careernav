import React, { useState } from "react";
import { uploadResumeFile } from "../services/api";
import "./ResumeInput.css";

export default function ResumeInput({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File too large. Max 2MB allowed.");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadResumeFile(file);

      if (res?.text) {
        onChange(res.text);
      } else {
        setError("Upload succeeded but no text extracted.");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setError("Upload failed. Try a different PDF or check server.");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  }

  return (
    <div className="resume-input">
      <label className="resume-upload-btn">
        <input
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileChange}
        />
        {uploading ? "Uploading..." : "Upload PDF Resume"}
      </label>

      {error && <div className="jm-error resume-error">{error}</div>}
    </div>
  );
}
