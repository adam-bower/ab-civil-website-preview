import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function TakeoffsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero Section with Image and Text */}
      <section
        className="relative bg-gray-900 text-white flex items-center"
        style={{
          backgroundImage: 'url(/takeoff-hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        {/* Overlay for transparency */}
        <div className="absolute inset-0 bg-gray-900 opacity-30"></div>

        {/* Very subtle left edge fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-transparent via-10% to-transparent"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="px-4 lg:pl-16">
            <div className="flex justify-center lg:justify-start">
              {/* Text content box */}
              <div className="bg-gray-900 bg-opacity-90 p-10 lg:p-16 rounded-2xl max-w-2xl">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 uppercase">
                  Takeoffs
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Get accurate earthwork quantities and material calculations.
                  We handle the takeoffs so you can focus on winning bids.
                </p>
                <button
                  onClick={() => window.location.href='/service-request'}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded uppercase text-lg transition-colors"
                >
                  GET A QUOTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 max-w-7xl mx-auto bg-gray-900">
        <div className="mb-16">
          <div className="max-w-5xl mx-auto mb-32">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Earthwork</h4>
                <p className="text-gray-400 text-sm">Cut/fill volumes, mass haul, topsoil stripping</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Paving &<br />Materials</h4>
                <p className="text-gray-400 text-sm">Asphalt tonnage, concrete volumes, aggregate quantities</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Underground<br />Utilities</h4>
                <p className="text-gray-400 text-sm">Trench volumes, pipe lengths, bedding materials</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Specialized</h4>
                <p className="text-gray-400 text-sm">Rock excavation, demolition, phased construction</p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 mb-16">
            {/* Bad Takeoffs Section */}
            <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6">
              <h3 className="text-xl font-semibold text-white mb-3">The Real Cost of Bad Takeoffs</h3>
              <p className="text-gray-300 mb-3">Bad quantities mean lost bids or lost profits. Underestimate and you eat the overruns. Overestimate and your competitor wins.</p>
              <p className="font-semibold text-white">Accurate takeoffs are the foundation of profitable projects. We make sure you have them.</p>
            </div>

            {/* Ready to Bid Better Section */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-200 mb-4">Ready to Bid Smarter?</h3>
              <p className="text-gray-400 mb-6">Stop guessing on quantities. Start bidding with accurate AGTEK takeoffs that win profitable work.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => window.location.href='/pricing'} className="bg-ab-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors">View Pricing</button>
                <button onClick={() => window.location.href='/service-request'} className="border-2 border-ab-blue text-ab-blue px-6 py-3 rounded-lg font-semibold hover:bg-ab-blue hover:text-white transition-colors">Request Takeoff</button>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400">
            <p>Have questions? Call us at <a href="tel:9315383026" className="text-ab-blue hover:text-ab-blue-dark">(931) 538-3026</a> or email <a href="mailto:info@ab-civil.com" className="text-ab-blue hover:text-ab-blue-dark">info@ab-civil.com</a>—you'll talk directly with a takeoff specialist who understands your project.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TakeoffsPage;