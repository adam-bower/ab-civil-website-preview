import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import PricingCalculator from '../calculator/PricingCalculator';
import './PricingPage.css';

function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mt-8">
        <Navigation />
      </div>
      
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Pricing Calculator</h1>
          <p className="text-xl text-gray-300">Get an instant estimate for your project</p>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PricingCalculator />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Base Pricing</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><strong className="text-white">Typical Surface Model:</strong> Per acre pricing</li>
                  <li><strong className="text-white">Linework Only:</strong> $450 flat</li>
                  <li><strong className="text-white">Erosion Surface:</strong> $450</li>
                  <li><strong className="text-white">Elevated Utilities:</strong> 10% of base</li>
                  <li><strong className="text-white">Advanced Utilities:</strong> $30/structure</li>
                </ul>
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