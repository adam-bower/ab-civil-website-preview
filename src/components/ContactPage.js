import React, { useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function ContactPage() {
  const [quickFormData, setQuickFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: ''
  });

  const handleQuickFormChange = (e) => {
    setQuickFormData({
      ...quickFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickFormSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission to Supabase
    console.log('Quick form submitted:', quickFormData);
    alert('Thank you! We\'ll call you within 2 hours during business hours.');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Start Your Project</h1>
          <p className="text-xl text-gray-300">Get a quote in minutes • Support in seconds</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <span className="text-ab-blue mr-2">✓</span>
              <span className="text-gray-300">2-hour response time</span>
            </div>
            <div className="flex items-center">
              <span className="text-ab-blue mr-2">✓</span>
              <span className="text-gray-300">100+ projects monthly</span>
            </div>
            <div className="flex items-center">
              <span className="text-ab-blue mr-2">✓</span>
              <span className="text-gray-300">Serving contractors nationwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {/* Service Pathways */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 hover:border-ab-blue transition-colors cursor-pointer" onClick={() => document.getElementById('quick-quote').scrollIntoView({ behavior: 'smooth' })}>
            <div className="text-ab-blue mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Get a Project Quote</h3>
            <p className="text-gray-400 mb-4">Machine control models, takeoffs, and more</p>
            <span className="text-ab-blue font-semibold">Start Quote →</span>
          </div>

          <a href="tel:9315383026" className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 hover:border-ab-blue transition-colors block no-underline">
            <div className="text-ab-blue mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Need Support Now?</h3>
            <p className="text-gray-400 mb-4">Remote support for Trimble systems</p>
            <span className="text-ab-blue font-semibold">Call (931) 538-3026 →</span>
          </a>

          <a href="mailto:info@ab-civil.com" className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 hover:border-ab-blue transition-colors block no-underline">
            <div className="text-ab-blue mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">General Questions</h3>
            <p className="text-gray-400 mb-4">Training, partnerships, or other inquiries</p>
            <span className="text-ab-blue font-semibold">Email Us →</span>
          </a>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Quick Quote Form */}
          <div id="quick-quote">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">Get Your Quote</h2>
              <p className="text-gray-400 mb-6">Fill out 5 quick fields. We'll call within 2 hours.</p>

              <form onSubmit={handleQuickFormSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={quickFormData.name}
                      onChange={handleQuickFormChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ab-blue focus:border-ab-blue"
                      placeholder="Your Name *"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="company"
                      required
                      value={quickFormData.company}
                      onChange={handleQuickFormChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ab-blue focus:border-ab-blue"
                      placeholder="Company *"
                    />
                  </div>
                </div>

                <input
                  type="email"
                  name="email"
                  required
                  value={quickFormData.email}
                  onChange={handleQuickFormChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ab-blue focus:border-ab-blue"
                  placeholder="Email Address *"
                />

                <input
                  type="tel"
                  name="phone"
                  value={quickFormData.phone}
                  onChange={handleQuickFormChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ab-blue focus:border-ab-blue"
                  placeholder="Phone (Optional)"
                />

                <select
                  name="projectType"
                  required
                  value={quickFormData.projectType}
                  onChange={handleQuickFormChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ab-blue focus:border-ab-blue"
                >
                  <option value="">Select Service Type *</option>
                  <option value="machine-control">Machine Control Model</option>
                  <option value="takeoff">Quantity Takeoff</option>
                  <option value="both">Model + Takeoff</option>
                  <option value="remote-support">Remote Support Subscription</option>
                  <option value="training">Training Services</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-ab-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors text-lg"
                >
                  Get Started →
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No spam, ever. We'll only contact you about your project.
                </p>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Why Choose AB Civil?</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-ab-blue mr-3 mt-1">✓</span>
                  <div>
                    <p className="text-gray-300 font-semibold">Fast Turnaround</p>
                    <p className="text-gray-500 text-sm">Most projects delivered in 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-ab-blue mr-3 mt-1">✓</span>
                  <div>
                    <p className="text-gray-300 font-semibold">Experienced Team</p>
                    <p className="text-gray-500 text-sm">100+ projects completed monthly since 2019</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-ab-blue mr-3 mt-1">✓</span>
                  <div>
                    <p className="text-gray-300 font-semibold">All Systems Supported</p>
                    <p className="text-gray-500 text-sm">Trimble, Topcon, Leica, and more</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Direct Contact Info */}
          <div>
            {/* Immediate Contact Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 shadow-xl border-2 border-ab-blue mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Need Help Right Now?</h3>
              <p className="text-gray-300 mb-6">Our team is standing by during business hours</p>

              <a href="tel:9315383026" className="flex items-center justify-center w-full bg-ab-blue text-white px-6 py-4 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors text-lg mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (931) 538-3026
              </a>

              <div className="text-center text-gray-400">
                <p className="text-sm">Monday - Friday: 8:00 AM - 5:00 PM CST</p>
                <p className="text-sm mt-1">Average response time: <span className="text-white font-semibold">Under 2 hours</span></p>
              </div>
            </div>

            {/* Office Information */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Office & Contact Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <a href="mailto:info@ab-civil.com" className="text-white hover:text-ab-blue transition-colors">info@ab-civil.com</a>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Main Office</p>
                  <p className="text-white">420 Madison St. B2</p>
                  <p className="text-white">Clarksville, TN 37040</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Business Hours</p>
                  <p className="text-white">Monday - Friday</p>
                  <p className="text-white">8:00 AM - 5:00 PM CST</p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-6 bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Interactive Map
                </p>
              </div>
            </div>

            {/* Client Testimonial */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start">
                <svg className="w-8 h-8 text-ab-blue mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div>
                  <p className="text-gray-300 italic mb-3">
                    "AB Civil has been our go-to for machine control models for 3 years. They catch issues before they become field problems and their turnaround time is unmatched."
                  </p>
                  <p className="text-white font-semibold">- Jake Thompson</p>
                  <p className="text-gray-500 text-sm">Project Manager, Thompson Excavation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactPage;