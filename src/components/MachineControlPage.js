import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function MachineControlPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Machine Control Modeling</h1>
          <p className="text-xl text-gray-300">Transform your engineering plans into precise 3D models that control every grade on your jobsite</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-900">
        <div className="mb-16">
          <p className="text-xl text-gray-300 mb-4">We create machine-ready surfaces for excavation contractors nationwide, turning complex CAD files into the digital roadmap your dozers, excavators, and rovers need to work efficiently.</p>

          <h3 className="text-2xl font-semibold text-gray-200 mb-6">Project Types We Handle</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Commercial Sites</h4>
              <p className="text-gray-400">From fast food restaurants to distribution centers, retail stores to office complexes—we model every type of commercial project</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Infrastructure</h4>
              <p className="text-gray-400">Roads, highways, subdivisions, and utilities—we handle the complex corridors and alignments that keep projects moving</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Specialized Work</h4>
              <p className="text-gray-400">Solar farms, landfills, industrial facilities—when standard approaches don't fit, we develop custom solutions</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-200 mb-6">Our Process</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border-l-4 border-ab-blue">
              <h4 className="text-lg font-semibold text-white mb-2">1. Plan Review</h4>
              <p className="text-gray-400">We analyze your engineering plans, identifying potential issues, missing information, and critical grades before modeling begins.</p>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border-l-4 border-ab-blue">
              <h4 className="text-lg font-semibold text-white mb-2">2. Clarification</h4>
              <p className="text-gray-400">When we spot problems—and we usually do—we document them for engineer resolution so you get accurate models, not guesswork.</p>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border-l-4 border-ab-blue">
              <h4 className="text-lg font-semibold text-white mb-2">3. Model Building</h4>
              <p className="text-gray-400">Experienced model builders create your 3D surfaces, incorporating all grades, utilities, and site features while documenting any field-critical issues we discover.</p>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border-l-4 border-ab-blue">
              <h4 className="text-lg font-semibold text-white mb-2">4. Double-Check QA</h4>
              <p className="text-gray-400">Our QA/QC team independently verifies spot elevations, sidewalk slopes, and roadway sections before final approval.</p>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border-l-4 border-ab-blue">
              <h4 className="text-lg font-semibold text-white mb-2">5. Export & Delivery</h4>
              <p className="text-gray-400">Models are exported in your machine's format—Trimble, Topcon, Leica, or LandXML—ready for immediate upload to your equipment.</p>
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">The Real Cost of Bad Models</h3>
            <p className="text-gray-300 mb-3">Inaccurate models lead to rework, wasted material, and blown schedules. Missing elevations mean operators guessing grades. Drainage issues discovered mid-project cost thousands to fix.</p>
            <p className="text-gray-300 mb-3">We catch these problems in the office, not the field. Our model builders think like contractors—checking that water flows where it should, grades tie properly, and your machines have everything they need to run efficiently.</p>
            <p className="font-semibold text-white">Your equipment investment only pays off with good data. We make sure you have it.</p>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">Ready to Build Better?</h3>
            <p className="text-gray-400 mb-6">Stop fighting bad models. Start running accurate data that keeps your projects on schedule and on grade.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button onClick={() => window.location.href='/pricing'} className="bg-ab-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors">View Pricing</button>
              <button onClick={() => window.location.href='/service-request'} className="border-2 border-ab-blue text-ab-blue px-8 py-3 rounded-lg font-semibold hover:bg-ab-blue hover:text-white transition-colors">Request Model</button>
            </div>
            <p className="text-gray-400">Have questions? Call us at <a href="tel:9315383026" className="text-ab-blue hover:text-ab-blue-dark">(931) 538-3026</a> or email <a href="mailto:info@ab-civil.com" className="text-ab-blue hover:text-ab-blue-dark">info@ab-civil.com</a>—you'll talk directly with a model builder who understands your project.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default MachineControlPage;