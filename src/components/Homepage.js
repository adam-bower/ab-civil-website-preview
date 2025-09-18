import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Trust from './Trust';
import Footer from './Footer';
import './Homepage.css';
import './Homepage-dark.css';

function Homepage() {
  return (
    <div className="homepage dark-theme">
      <Hero />
      <Services />
      <Trust />
      <Footer />
    </div>
  );
}

export default Homepage;