import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import ProjectCounter from './ProjectCounter';

function Hero() {
  const navigate = useNavigate();

  const phrases = [
    'Models That Work',
    'Takeoffs That Save',
    'Precision You Trust'
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return (
    <section className="hero" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${process.env.PUBLIC_URL}/images/3d_model_hero_image.png)`
    }}>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-static">3D Machine Control</span>
          <span className={`hero-title-dynamic ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            {phrases[currentPhraseIndex]}
          </span>
        </h1>
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