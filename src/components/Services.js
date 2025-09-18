import React from 'react';
import './Services.css';

function Services() {
  const services = [
    {
      id: 'modeling',
      title: '3D Machine Control Modeling',
      description: 'Transform your plans into precision machine control models. Every surface, every grade, every detail—built with systematic accuracy and delivered when you need it.',
      icon: '📐'
    },
    {
      id: 'takeoffs',
      title: 'Takeoffs & Earthwork Calculations',
      description: 'Get accurate volume calculations and cut/fill analysis you can stake your bid on. Our detailed takeoffs give you the numbers that matter.',
      icon: '📊'
    },
    {
      id: 'support',
      title: 'Remote Support',
      description: 'Never lose productivity to calibration issues. Our real-time remote support gets your operators back to work fast, with expert guidance when you need it.',
      icon: '🛠️'
    }
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href={`#${service.id}`} className="service-link">Learn More →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;