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
          backgroundImage: 'url(/services-hero-5.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 50px',
          backgroundRepeat: 'no-repeat',
          minHeight: '125vh'
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-35"></div>

        {/* What We Do Title and Service Cards - Absolutely positioned */}
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-8 w-full">
            {/* What We Do Title */}
            <div className="text-center mb-12">
              <div className="text-4xl md:text-5xl font-bold text-white" role="heading" aria-level="1">What We Do</div>
            </div>

            {/* Service Cards - 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Machine Control Modeling Card */}
          <div
            className="relative rounded-lg shadow-xl border border-gray-200 cursor-pointer overflow-hidden"
            style={{
              backgroundImage: 'url(/modeling-image-2.png)',
              backgroundSize: '110%',
              backgroundPosition: 'right top',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#374151',
              minHeight: '300px'
            }}
            onClick={() => window.location.href='/services/machine-control'}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>
            <div className="relative p-8 h-full flex flex-col justify-between pt-12">
              <h3 className="text-4xl font-bold text-white leading-tight">Machine Control<br />Modeling</h3>
              <div className="text-white font-semibold text-lg mt-4">Learn More →</div>
            </div>
          </div>

          {/* Takeoffs Card */}
          <div
            className="relative rounded-lg shadow-xl border border-gray-200 cursor-pointer overflow-hidden"
            style={{
              backgroundImage: 'url(/takeoff-image-2.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#374151',
              minHeight: '300px'
            }}
            onClick={() => window.location.href='/services/takeoffs'}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>
            <div className="relative p-8 h-full flex flex-col justify-between pt-12">
              <h3 className="text-4xl font-bold text-white leading-tight">Takeoffs<br />&nbsp;</h3>
              <div className="text-white font-semibold text-lg mt-4">Learn More →</div>
            </div>
          </div>

          {/* Remote Support Card */}
          <div
            className="relative rounded-lg shadow-xl border border-gray-200 cursor-pointer overflow-hidden"
            style={{
              backgroundImage: 'url(/remote-support.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '300px'
            }}
            onClick={() => window.location.href='/services/remote-support'}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
            <div className="relative p-8 h-full flex flex-col justify-between pt-12">
              <h3 className="text-4xl font-bold text-white leading-tight">Remote<br />Support</h3>
              <div className="text-white font-semibold text-lg mt-4">Learn More →</div>
            </div>
          </div>

          {/* Training Card */}
          <div
            className="relative rounded-lg shadow-xl border border-gray-200 cursor-pointer overflow-hidden"
            style={{
              backgroundImage: 'url(/thinkific-training.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
              minHeight: '300px'
            }}
            onClick={() => window.location.href='/model-building-course'}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
            <div className="relative p-8 h-full flex flex-col justify-between pt-12">
              <h3 className="text-4xl font-bold text-white leading-tight">Training<br />&nbsp;</h3>
              <div className="text-white font-semibold text-lg mt-4">Learn More →</div>
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

export default ServicesPage;