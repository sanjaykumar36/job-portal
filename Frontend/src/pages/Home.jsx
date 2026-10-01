import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
const navigate = useNavigate();
const [message, setMessage] = useState("");

const getUser = () => {
const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


if (!token || !userData) {
  return null;
}

try {
  return JSON.parse(userData);
} catch (error) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
}


};

const handleFindJob = () => {
setMessage("");


const user = getUser();

if (!user) {
  navigate("/login");
  return;
}

if (user.role === "candidate") {
  navigate("/candidate-dashboard");
  return;
}

if (user.role === "recruiter") {
  setMessage(
    "You are logged in as a recruiter. Please use 'Post a Job'."
  );
  return;
}

};

const handlePostJob = () => {
setMessage("");


const user = getUser();

if (!user) {
  navigate("/login");
  return;
}

if (user.role === "recruiter") {
  navigate("/recruiter-dashboard");
  return;
}

if (user.role === "candidate") {
  setMessage(
    "You are logged in as a candidate. Please use 'Find a Job'."
  );
  return;
}


};

return ( <div className="home-page">

  <section className="hero-section">
    <div className="hero-content">

      <div className="hero-badge">
        🚀 Connecting Talent With Opportunity
      </div>

      <h1>
        Find Your Next
        <span> Opportunity</span>
      </h1>

      <p>
        A modern job portal where candidates can discover
        opportunities and recruiters can find talented
        professionals.
      </p>

      <div className="hero-buttons">

        <button
          type="button"
          className="hero-primary-btn"
          onClick={handleFindJob}
        >
          Find a Job
        </button>

        <button
          type="button"
          className="hero-secondary-btn"
          onClick={handlePostJob}
        >
          Post a Job
        </button>

      </div>

      {message && (
        <div className="home-message">
          {message}
        </div>
      )}

    </div>
  </section>


  <section className="features-section">

    <div className="section-heading">
      <span>WHY JOBPORTAL</span>

      <h2>
        Everything You Need To Find The Right Opportunity
      </h2>

      <p>
        Simple tools for candidates and recruiters to
        connect, apply and hire efficiently.
      </p>
    </div>

    <div className="features-grid">

      <div className="feature-card">

        <div className="feature-icon">
          🔍
        </div>

        <h3>
          Find Jobs
        </h3>

        <p>
          Browse available job opportunities and discover
          positions that match your skills.
        </p>

      </div>


      <div className="feature-card">

        <div className="feature-icon">
          📄
        </div>

        <h3>
          Easy Applications
        </h3>

        <p>
          Upload your resume and apply for jobs quickly
          through your candidate dashboard.
        </p>

      </div>


      <div className="feature-card">

        <div className="feature-icon">
          👥
        </div>

        <h3>
          Hire Talent
        </h3>

        <p>
          Recruiters can post jobs, review applications
          and manage candidates from one dashboard.
        </p>

      </div>

    </div>

  </section>


  <section className="how-section">

    <div className="section-heading">

      <span>
        HOW IT WORKS
      </span>

      <h2>
        Simple Process
      </h2>

      <p>
        Get started in just a few steps.
      </p>

    </div>


    <div className="steps-grid">

      <div className="step-card">

        <div className="step-number">
          01
        </div>

        <h3>
          Create Your Account
        </h3>

        <p>
          Register as a candidate or recruiter and create
          your account.
        </p>

      </div>


      <div className="step-card">

        <div className="step-number">
          02
        </div>

        <h3>
          Connect
        </h3>

        <p>
          Candidates apply for jobs while recruiters
          review applications.
        </p>

      </div>


      <div className="step-card">

        <div className="step-number">
          03
        </div>

        <h3>
          Grow Your Career
        </h3>

        <p>
          Find opportunities and connect with the right
          talent.
        </p>

      </div>

    </div>

  </section>


  <section className="cta-section">

    <div className="cta-content">

      <h2>
        Ready to Get Started?
      </h2>

      <p>
        Create your account and start exploring
        opportunities today.
      </p>

      <Link
        to="/register"
        className="cta-button"
      >
        Create Account
      </Link>

    </div>

  </section>


  <footer className="home-footer">

    <div>

      <strong>
        JobPortal
      </strong>

      <span>
        © 2026 JobPortal. All rights reserved.
      </span>

    </div>

  </footer>

</div>

);
}

export default Home;
