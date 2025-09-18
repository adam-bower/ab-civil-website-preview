import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

function ServicesPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to section if hash is present, but skip machine-control as it's at the top
    if (location.hash && location.hash !== '#machine-control') {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section
        className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white"
        style={{
          backgroundImage: 'url(/services-image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '80vh'
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
      </section>

      {/* What We Do Title and Service Cards Section */}
      <section className="bg-gray-900" style={{ marginTop: '-50vh', paddingTop: '50vh' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* What We Do Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">What We Do</h1>
          </div>

          {/* Service Cards - 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Machine Control Modeling Card */}
          <div
            className="relative rounded-lg shadow-xl border border-gray-700 hover:border-ab-blue transition-colors cursor-pointer overflow-hidden"
            style={{
              backgroundImage: 'url(/drone-with-surface.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'left top',
              backgroundRepeat: 'no-repeat',
              minHeight: '400px'
            }}
            onClick={() => window.location.href='/services/machine-control'}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
            <div className="relative p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">3D Machine Control Modeling</h3>
              <div className="text-ab-blue font-semibold">Learn More →</div>
            </div>
          </div>

          {/* Takeoffs Card */}
          <div
            className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 hover:border-ab-blue transition-colors cursor-pointer overflow-hidden"
            style={{ minHeight: '400px' }}
            onClick={() => window.location.href='/services/takeoffs'}
          >
            <div className="relative p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">Takeoffs & Earthwork Calculations</h3>
              <div className="text-ab-blue font-semibold">Learn More →</div>
            </div>
          </div>

          {/* Remote Support Card */}
          <div
            className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 hover:border-ab-blue transition-colors cursor-pointer overflow-hidden"
            style={{ minHeight: '400px' }}
            onClick={() => window.location.href='/services/remote-support'}
          >
            <div className="relative p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">Remote Support</h3>
              <div className="text-ab-blue font-semibold">Learn More →</div>
            </div>
          </div>

          {/* Training Card */}
          <div
            className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 hover:border-ab-blue transition-colors cursor-pointer overflow-hidden"
            style={{ minHeight: '400px' }}
            onClick={() => window.location.href='/model-building-course'}
          >
            <div className="relative p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">Training</h3>
              <div className="text-ab-blue font-semibold">Learn More →</div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ServicesPage;