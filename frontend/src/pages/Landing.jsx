// Landing.jsx
// import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import React, { useState, useEffect } from "react"; // add useState and useEffect

export default function Landing() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "80px 50px", background: "#f5f7fa" }}>
  <div className="hero-text" style={{ maxWidth: "45%" }}>
    <h1>Pitch Your Gigs. Showcase Your Talent.</h1>
    <p>Connect with clients, grow your network, and get hired faster.</p>
    <button onClick={() => navigate("/jobs")} style={{ padding: "12px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px" }}>Explore Jobs</button>
  </div>

  <div className="hero-images" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", maxWidth: "50%" }}>
    <img src="https://cdn7.dissolve.com/p/D430_50_041/D430_50_041_1200.jpg" alt="Creative Work" style={{ width: "100%", borderRadius: "12px" }} />
    <img src="https://www.chitkara.edu.in/cbs/wp-content/uploads/2022/11/integrated.jpg" alt="Team Collaboration" style={{ width: "100%", borderRadius: "12px" }} />
    <img src="https://www.chitkara.edu.in/cbs/wp-content/uploads/2025/05/BBA-Professional-Program-Chitkara-Business-School.jpg" alt="Digital Skills" style={{ width: "100%", borderRadius: "12px" }} />
    <img src="https://www.chitkara.edu.in/blogs/wp-content/uploads/2025/01/Interns.jpg" alt="Remote Work" style={{ width: "100%", borderRadius: "12px" }} />
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
    <section className="stats">
      <div className="stat-item">
        <h2>10,000+</h2>
        <p>Students Joined</p>
      </div>
      <div className="stat-item">
        <h2>1,200+</h2>
        <p>Active Gigs</p>
      </div>
      <div className="stat-item">
        <h2>300+</h2>
        <p>Verified Clients</p>
      </div>
    </section>

    <section className="categories">
      <h2>Popular Categories</h2>
      <div className="category-grid">
        {["Web Development","Graphic Design","Content Writing","Video Editing","Photography","App Development"].map((cat) => (
          <div key={cat} className="category-card">{cat}</div>
        ))}
      </div>
    </section>

      <section className="how-it-works">
        <h2>How CampusGig Works</h2>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Create an account on CampusGig</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Showcase your skills & portfolio</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Apply for gigs & get hired!</p>
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

        <section className="location-map">
        <h2>Find Us Here</h2>
        <iframe
          title="CampusGig Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.1749717999796!2d76.65720287482759!3d30.51609109607186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fc32344a6e2d7%3A0x81b346dee91799ca!2sChitkara%20University!5e0!3m2!1sen!2sin!4v1762922379648!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
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

            {/* Pop-up */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <h3>🚀 New Feature Alert!</h3>
            <p>Check out the latest real-time chat feature on CampusGig!</p>
            <button onClick={() => navigate("/jobs")}>Explore Jobs</button>
          </div>
        </div>
      )}

    </div>
  );
}
