import React from 'react';
import Navigation from './Navigation';
import heroVideo from '../assets/hero-video.mp4';

function SemanticHomepage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation component */}
      <Navigation />

      <section className="relative h-[70vh] overflow-hidden bg-gray-900">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-screen h-full object-cover slow-video"
          style={{ minWidth: '100vw', width: '100vw', objectPosition: '50% 20%' }}
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.75;
            }
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Models That Work. Takeoffs That Count. Support That Matters.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-lg">
              Complete machine control services for contractors who refuse to compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href='/service-request'}
                className="bg-ab-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors shadow-lg text-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => window.location.href='/pricing'}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors shadow-lg text-lg"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 hover:bg-gray-750 transition-all border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-white">Machine Control Models</h3>
              <p className="text-gray-300 mb-4">Precision 3D models for GPS machine control systems. Compatible with Trimble, Topcon, Leica, and more.</p>
              <button onClick={() => window.location.href='/services'} className="text-ab-blue font-semibold hover:text-ab-blue-light transition-colors">Learn More →</button>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 hover:bg-gray-750 transition-all border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-white">Takeoffs</h3>
              <p className="text-gray-300 mb-4">Accurate material quantity calculations and earthwork analysis for confident bidding.</p>
              <button onClick={() => window.location.href='/services'} className="text-ab-blue font-semibold hover:text-ab-blue-light transition-colors">Learn More →</button>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 hover:bg-gray-750 transition-all border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-white">Remote Support</h3>
              <p className="text-gray-300 mb-4">Expert technical support when you need it. Full Trimble support, Topcon file uploads.</p>
              <button onClick={() => window.location.href='/services'} className="text-ab-blue font-semibold hover:text-ab-blue-light transition-colors">Learn More →</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-bold mb-3 text-white">Free Trimble Support App</h3>
              <p className="text-gray-300 mb-4">Download our free app for instant Trimble machine control support and resources.</p>
              <button onClick={() => window.location.href='/free-resources'} className="bg-ab-blue text-white px-6 py-2 rounded-lg hover:bg-ab-blue-light transition-colors">Download App</button>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-bold mb-3 text-white">Free TBC Model Building Course</h3>
              <p className="text-gray-300 mb-4">Learn to build professional models in Trimble Business Center with our comprehensive training course.</p>
              <button onClick={() => window.location.href='/free-resources'} className="bg-ab-blue text-white px-6 py-2 rounded-lg hover:bg-ab-blue-light transition-colors">Start Course</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">info@ab-civil.com</p>
              <p className="text-gray-300">(931) 538-3026</p>
              <p className="text-gray-300">420 Madison St. B2</p>
              <p className="text-gray-300">Clarksville, TN 37040</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col space-y-2">
                <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="/service-request" className="text-gray-300 hover:text-white transition-colors">Get Quote</a>
                <a href="/client-intake" className="text-gray-300 hover:text-white transition-colors">Register</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <div className="flex flex-col space-y-2">
                <a href="/services#takeoffs" className="text-gray-300 hover:text-white transition-colors">Material Takeoffs</a>
                <a href="/services#machine-control" className="text-gray-300 hover:text-white transition-colors">Machine Control</a>
                <a href="/free-resources" className="text-gray-300 hover:text-white transition-colors">Training</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 AB Civil</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SemanticHomepage;