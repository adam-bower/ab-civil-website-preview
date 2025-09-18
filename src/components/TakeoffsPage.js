import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function TakeoffsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quantity Takeoffs</h1>
          <p className="text-xl text-gray-300">Get accurate earthwork quantities and material calculations to bid confidently and win more work</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-900">
        <div className="mb-16">
          <p className="text-xl text-gray-300 mb-8">Using industry-leading AGTEK software, we calculate cut/fill volumes, material quantities, and underground utilities so you know exactly what you're bidding on—no surprises, no guesswork.</p>

          <h3 className="text-2xl font-semibold text-gray-200 mb-6">What We Calculate</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Earthwork Volumes</h4>
              <p className="text-gray-400">Cut/fill quantities, mass haul analysis, and topsoil stripping calculations for balanced site work</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Material Quantities</h4>
              <p className="text-gray-400">Asphalt tonnage, concrete volumes, aggregate base, and all finished surface areas</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Underground Utilities</h4>
              <p className="text-gray-400">Trench volumes, bedding requirements, backfill quantities, and pipe/fitting counts</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Specialized Analysis</h4>
              <p className="text-gray-400">Rock excavation quantities, demolition volumes, and phased construction breakdowns</p>
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">Why Accurate Takeoffs Matter</h3>
            <p className="text-gray-300 mb-3">Bad quantities kill profits. Underestimate and you absorb the cost overruns. Overestimate and you lose the bid.</p>
            <p className="text-gray-300">Our AGTEK-powered takeoffs give you fast, thorough quantity calculations with complete documentation review. We deliver detailed reports that help you identify project scope, understand site challenges, and bid with confidence—all with the quick turnaround you need to meet bid deadlines.</p>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">Ready to Bid Smarter?</h3>
            <p className="text-gray-400 mb-6">Get the accurate quantities you need to win profitable work.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button onClick={() => window.location.href='/pricing'} className="bg-ab-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors">View Pricing</button>
              <button onClick={() => window.location.href='/get-started'} className="border-2 border-ab-blue text-ab-blue px-8 py-3 rounded-lg font-semibold hover:bg-ab-blue hover:text-white transition-colors">Get Started</button>
            </div>
            <p className="text-gray-400">Have questions? Call us at <a href="tel:9315383026" className="text-ab-blue hover:text-ab-blue-dark">(931) 538-3026</a> or email <a href="mailto:info@ab-civil.com" className="text-ab-blue hover:text-ab-blue-dark">info@ab-civil.com</a>—you'll talk directly with a takeoff specialist who understands your bidding needs.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TakeoffsPage;