import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import ProjectCounter from './ProjectCounter';

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return (
    <section className="hero" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${process.env.PUBLIC_URL}/images/3d_model_hero_image.png)`
    }}>
      <div className="hero-content">
        <h1 className="hero-title">Precision 3D Machine Control Modeling You Can Trust</h1>
        <p className="hero-subtitle">
          Specialized machine control models for excavation, grading, and earthwork contractors.
          Built with unmatched precision and radical transparency.
        </p>
        <button className="hero-cta" onClick={handleGetStarted}>See Our Pricing</button>
        <div className="hero-badge">
          <ProjectCounter showExact={true} />
        </div>
      </div>
    </section>
  );
}

export default Hero;