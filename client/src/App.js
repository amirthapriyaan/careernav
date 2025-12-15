// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import JobMatchPage from "./pages/JobMatchPage";
import ChatPage from "./pages/ChatPage";
import RoadmapPage from "./pages/RoadmapPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import Navbar from "./components/Navbar";
import ThoughtFor21s from "./components/ThoughtFor21s";
import ProfilePage from "./pages/ProfilePage";
import JobMatchResult from "./pages/JobMatchResult";
import "./App.css";

/**
 * PageContent: Wrap pages that should be constrained (center column)
 * Use this when you want the page to be max-width centered.
 */
function PageContent({ children }) {
  return (
    <div className="app-main" style={{ width: "100%", boxSizing: "border-box",    }}>
      <div
        className="page-content"
    style={{
      maxWidth: 1600,
      margin: "0 auto",
      padding: "0px",
      boxSizing: "border-box",
     
    }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * RouterWrapper decides whether to render a route inside PageContent
 * or render it full-bleed. This keeps Routes simple and prevents
 * duplicate/overlapping Routes that cause the "No routes matched" warnings.
 */
function RouterWrapper() {
  // If you need to treat more routes as full-bleed, add them to this set.
  const fullBleedRoutes = new Set(["/profile"]);
  const location = useLocation();
  const path = location.pathname;

  const isFullBleed = fullBleedRoutes.has(path);

  return (
    // single Routes tree for the app
    <Routes>
      {/* Full-bleed profile route (renders ProfilePage directly) */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Constrained routes */}
      <Route
        path="/"
        element={
          <PageContent>
            <JobMatchPage />
          </PageContent>
        }
      />
      <Route
        path="/job-match"
        element={
          <PageContent>
            <JobMatchPage />
          </PageContent>
        }
      />
      <Route
        path="/job-match/result"
        element={
          <PageContent>
            <JobMatchResult />
          </PageContent>
        }
      />
      <Route
        path="/chat"
        element={
          <PageContent>
            <ChatPage />
          </PageContent>
        }
      />
      <Route
        path="/roadmap"
        element={
          <PageContent>
            <RoadmapPage />
          </PageContent>
        }
      />
      <Route
        path="/interview-prep"
        element={
          <PageContent>
            <InterviewPrepPage />
          </PageContent>
        }
      />
      <Route
        path="/login"
        element={
          <PageContent>
            <LoginPage />
          </PageContent>
        }
      />
      <Route
        path="/signup"
        element={
          <PageContent>
            <SignupPage />
          </PageContent>
        }
      />

      {/* fallback - show JobMatchPage as homepage if no route matched (optional) */}
      <Route
        path="*"
        element={
          <PageContent>
            <JobMatchPage />
          </PageContent>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <ThoughtFor21s />
        <RouterWrapper />
      </div>
    </BrowserRouter>
  );
}
