import React, { useState, useRef, useCallback } from "react";
import { uploadPdfFile } from "../services/api";
import "./PdfUpload.css";

export default function PdfUpload({
  label = "Upload PDF",
  onExtracted = () => {},
  maxSizeMB = 5,
  className = "",
}) {
  const inputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;

      setError("");

      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max ${maxSizeMB} MB allowed.`);
        return;
      }

      try {
        setUploading(true);
        const res = await uploadPdfFile(file);

        if (typeof res?.text === "string") {
          onExtracted(res.text);
          showToast(`${label} extracted — ready to analyze.`);
        } else {
          setError("No text extracted from PDF.");
        }
      } catch (err) {
        console.error("PDF upload error:", err);
        setError(err?.response?.data?.error || "Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [label, maxSizeMB, onExtracted]
  );

  const onChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = null;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className={`pdf-upload-root ${className}`}>
      <label
        className={`pdf-dropzone ${dragActive ? "pdf-dropzone--active" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={onChange}
        />

        <div
          className="pdf-dropzone-inner"
          onClick={() => inputRef.current?.click()}
        >
          <div className="pdf-icon">📄</div>

          <div className="pdf-meta">
            <div className="pdf-label">{label}</div>
            <div className="pdf-sub">
              Drop PDF here or click to upload (max {maxSizeMB}MB)
            </div>
          </div>

          <div className="pdf-action">
            {uploading ? (
              <div className="pdf-spinner" />
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Choose file
              </button>
            )}
          </div>
        </div>
      </label>

      {error && <div className="jm-error pdf-error">{error}</div>}
      {toast && <div className="pdf-toast">{toast}</div>}
    </div>
  );
}
