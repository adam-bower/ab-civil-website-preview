import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function RemoteSupportPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Remote Support</h1>
          <p className="text-xl text-gray-300">Get instant technical help when you need it most—no more waiting with idle machines</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-900">
        <div className="mb-16">
          <p className="text-xl text-gray-300 mb-8">Our remote support gives Trimble Siteworks and Earthworks users immediate access to experienced professionals who can solve problems in real-time by remoting directly into your data collector.</p>

          <h3 className="text-2xl font-semibold text-gray-200 mb-6">What We Support</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Trimble Siteworks</h4>
              <p className="text-gray-400">Full support for all features, settings, and troubleshooting</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Trimble Earthworks</h4>
              <p className="text-gray-400">Complete assistance with setup, operation, and problem-solving</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Model Upload & Management</h4>
              <p className="text-gray-400">Help getting files loaded, organized, and running correctly</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Cloud File Transfer</h4>
              <p className="text-gray-400">Assistance with uploading and downloading through our custom cloud solution</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Basic Setup & Calibration</h4>
              <p className="text-gray-400">Guidance on initial configuration and verification</p>
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">How It Works</h3>
            <p className="text-gray-300">When you hit a problem, just call. Our support team remotes into your data collector, sees exactly what you're seeing, and guides you through the solution. No scheduling, no waiting—just immediate help to keep your projects moving.</p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">Don't Let Tech Issues Stop Production</h3>
            <p className="text-gray-400 mb-6">Get expert support the moment you need it.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button onClick={() => window.location.href='/pricing'} className="bg-ab-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors">View Support Plans</button>
              <button onClick={() => window.location.href='/contact'} className="border-2 border-ab-blue text-ab-blue px-8 py-3 rounded-lg font-semibold hover:bg-ab-blue hover:text-white transition-colors">Contact Us</button>
            </div>
            <p className="text-gray-400">Need immediate support? Call us at <a href="tel:9315383026" className="text-ab-blue hover:text-ab-blue-dark">(931) 538-3026</a> or email <a href="mailto:support@ab-civil.com" className="text-ab-blue hover:text-ab-blue-dark">support@ab-civil.com</a>—we're here to get you back up and running fast.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RemoteSupportPage;