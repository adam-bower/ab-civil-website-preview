import React from 'react';
import './PlainText.css';

function PlainTextHomepage() {
  return (
    <div className="plain-text-container">
      <header>
        <h1>AB Civil</h1>
        <p>Professional Civil Engineering Services</p>
      </header>

      <nav>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#forms">Forms</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </nav>

      <main>
        <section id="services">
          <h2>Our Services</h2>
          <ul>
            <li>
              <h3>Material Takeoffs</h3>
              <p>Accurate quantity calculations for concrete, rebar, steel, and earthwork.</p>
            </li>
            <li>
              <h3>Lump Sum Pricing</h3>
              <p>Comprehensive fixed-price quotes for your civil construction projects.</p>
            </li>
            <li>
              <h3>Model Building Training</h3>
              <p>Professional training in construction modeling and quantity estimation.</p>
            </li>
            <li>
              <h3>Civil 3D Services</h3>
              <p>Advanced civil engineering design and modeling using AutoCAD Civil 3D.</p>
            </li>
            <li>
              <h3>Project Management</h3>
              <p>End-to-end civil project coordination and management.</p>
            </li>
          </ul>
        </section>

        <section id="contact">
          <h2>Contact Information</h2>
          <p>Email: info@ab-civil.com</p>
          <p>Phone: 1300 AB CIVIL</p>
          <p>Location: Brisbane, Queensland, Australia</p>
        </section>

        <section id="forms">
          <h2>Get Started</h2>
          <ul>
            <li><a href="/client-intake">Client Intake Form</a> - New client registration</li>
            <li><a href="/service-request">Service Request Form</a> - Request our services</li>
            <li><a href="/model-training">Model Building Training Interest</a> - Register for training</li>
          </ul>
        </section>

        <section id="why-choose-us">
          <h2>Why Choose AB Civil</h2>
          <ul>
            <li>20+ years of industry experience</li>
            <li>Accurate and reliable estimates</li>
            <li>Fast turnaround times</li>
            <li>Competitive pricing</li>
            <li>Professional service</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 AB Civil. All rights reserved.</p>
        <p>ABN: 123 456 789</p>
      </footer>
    </div>
  );
}

export default PlainTextHomepage;