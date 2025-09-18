import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import PricingCalculator from '../calculator/PricingCalculator';
import './PricingPage.css';

function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">No Guessing. No Surprises. Just Clear Pricing.</h1>
          <p className="text-xl text-gray-300">Calculate your exact project cost instantly with our pricing calculator</p>
        </div>
      </section>

      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <PricingCalculator />
            </div>

            <div className="space-y-6 max-w-md">
              <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Models</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><strong className="text-white">Typical Site Model:</strong> Per acre pricing</li>
                  <li><strong className="text-white">Linework Only:</strong> $450 flat</li>
                </ul>
                <h4 className="text-lg font-semibold text-white mt-4 mb-2">Add-on Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><strong className="text-white">Erosion Surface:</strong> +$450</li>
                  <li><strong className="text-white">Elevated Utilities:</strong> +10% of base</li>
                  <li><strong className="text-white">Advanced Utilities:</strong> +$30/structure</li>
                </ul>
                <p className="text-sm text-gray-400 mt-2 italic">(Advanced Utilities requires Elevated Utilities)</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Takeoffs</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><strong className="text-white">Pricing:</strong> Always custom</li>
                </ul>
                <div className="mt-4">
                  <a href="/service-request?service=takeoff&type=quote" className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Takeoff Quote →
                  </a>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Remote Support</h3>
                <p className="text-gray-300 mb-4">Annual support packages available:</p>
                <ul className="space-y-2 text-gray-300">
                  <li><strong className="text-white">Base Package:</strong> $1,000/year</li>
                  <li><strong className="text-white">Additional Data Collectors:</strong> $500 each</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Request Forms</h3>
                <p className="text-gray-300 mb-4">Ready to get started?</p>
                <div className="space-y-3">
                  <a href="/forms/service-request" className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Model/Takeoff Request →
                  </a>
                  <a href="/forms/client-intake" className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    New Client Intake →
                  </a>
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

export default PricingPage;