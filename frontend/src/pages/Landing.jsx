// Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Pitch Your Gigs. Showcase Your Talent.</h1>
          <p>Connect with clients, grow your network, and get hired faster.</p>
          <button onClick={() => navigate("/jobs")}>Explore Jobs</button>
        </div>
        <div className="hero-image">
          <img src="https://cdn7.dissolve.com/p/D430_50_041/D430_50_041_1200.jpg" alt="Creative Work" />
        </div>
      </section>
    <section className="features">
    <h2>Why Choose CampusGig?</h2>
    <div className="features-grid">
        <div className="feature-card">
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Connect" />
        <h3>Connect with Clients</h3>
        <p>Find freelance projects and gigs that match your skills and interests.</p>
        </div>
        <div className="feature-card">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Grow" />
        <h3>Grow Professionally</h3>
        <p>Showcase your portfolio and build credibility in your field.</p>
        </div>
        <div className="feature-card">
        <img src="https://cdn-icons-png.flaticon.com/512/2910/2910764.png" alt="Get Hired" />
        <h3>Get Hired Faster</h3>
        <p>Clients can directly reach out to you for projects and collaborations.</p>
        </div>
    </div>
    </section>

    <section className="testimonials">
    <h2>What Students Say</h2>
    <div className="testimonial-cards">
        <div className="testimonial-card">
        <p>"CampusGig helped me get my first freelance project while still in college!"</p>
        <strong>- Priya Sharma</strong>
        </div>
        <div className="testimonial-card">
        <p>"Amazing platform for networking and finding gigs that match your skills."</p>
        <strong>- Raj Patel</strong>
        </div>
    </div>
    </section>

    <section className="cta">
    <h2>Ready to Launch Your Career?</h2>
    <button onClick={() => navigate("/signup")}>Sign Up Now</button>
    </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About CampusGig</h3>
            <p>
              Empowering students and freelancers to showcase their skills,
              find projects, and grow professionally.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/jobs">All Jobs</a></li>
              <li><a href="/post-job">Post a Job</a></li>
              <li><a href="/signup">Sign Up</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@campusgig.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="socials">
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CampusGig. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
