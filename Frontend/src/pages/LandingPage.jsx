import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'

function LandingPage() {

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  }

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1 className="hero-title">Personalized Healthcare at Your Fingertips</h1>
            <p className="hero-subtitle">
              Cura AI is your smart assistant, making healthcare more accessible and intelligent. 
              Get instant symptom analysis, manage appointments, and receive personalized health insights.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="btn-hero">Get Started Now</Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-image">
              <div className="hero-image-overlay">
                <div className="hero-grid">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className="hero-grid-item"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <motion.div {...fadeInUp} className="section-header">
            <h2 className="section-title">How Cura AI Can Help You</h2>
            <p className="section-subtitle">Everything you need for smarter health management</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="features-grid">
            <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.3 } }} className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="feature-title">Instant Symptom Analysis</h3>
              <p className="feature-description">Get immediate, intelligent feedback on your symptoms anytime, anywhere.</p>
              <a href="#" className="feature-link">
                Learn More
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.3 } }} className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Appointment Scheduling</h3>
              <p className="feature-description">Easily schedule, track, and get reminders for all your medical appointments.</p>
              <a href="#" className="feature-link">
                Learn More
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.3 } }} className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="feature-title">Medication Reminders</h3>
              <p className="feature-description">Receive tailored advice and information based on your unique health profile.</p>
              <a href="#" className="feature-link">
                Learn More
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="mission-section">
        <div className="mission-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mission-image">
              <div className="mission-image-overlay">
                <div className="mission-grid">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="mission-grid-item"
                    >
                      {i % 4 === 0 ? '🏥' : i % 4 === 1 ? '💉' : i % 4 === 2 ? '🩺' : '💊'}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mission-content"
          >
            <h2 className="mission-title">Our Mission: Healthcare, Reimagined</h2>
            <p className="mission-text">
              We believe in a future where everyone has access to intelligent, personalized, 
              and compassionate healthcare. Cura AI is our first step towards making that 
              future a reality by putting a smart health assistant in your pocket.
            </p>
            <p className="mission-text">
              Our AI-powered platform combines cutting-edge technology with medical expertise 
              to provide you with accurate, reliable, and personalized health information whenever you need it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <motion.div {...fadeInUp} className="section-header">
            <h2 className="section-title">Trusted by Users Like You</h2>
            <p className="section-subtitle">See what our community has to say</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="testimonials-grid">
            <motion.div variants={fadeInUp} className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">
                "Cura AI has been a game-changer for managing my family's health. The symptom 
                checker is incredibly accurate and reassuring."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <p className="author-name">John D.</p>
                  <p className="author-role">Father of Two</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">
                "As someone with a chronic condition, the medication reminders are a lifesaver. 
                I feel so much more in control of my health."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar purple">SK</div>
                <div className="author-info">
                  <p className="author-name">Sarah K.</p>
                  <p className="author-role">Health Advocate</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">
                "Booking appointments used to be a hassle. With Cura AI, it's just a few taps. 
                Simple, efficient, and brilliant."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar green">MB</div>
                <div className="author-info">
                  <p className="author-name">Michael B.</p>
                  <p className="author-role">Fitness Enthusiast</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="cta-container"
        >
          <div className="cta-box">
            <h2 className="cta-title">Take Control of Your Health Today</h2>
            <p className="cta-text">
              Join thousands of users who are making their health a priority with Cura AI. 
              Sign up for free and get started in minutes.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="btn-cta">Sign Up for Free</Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
