import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function MachineControlPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero Section with Image and Text */}
      <section
        className="relative bg-gray-900 text-white flex items-center"
        style={{
          backgroundImage: 'url(/gunrange2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        {/* Overlay for transparency */}
        <div className="absolute inset-0 bg-gray-900 opacity-30"></div>

        {/* Very subtle left edge fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-transparent via-8% to-transparent"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="px-4 lg:pl-16">
            <div className="flex justify-center lg:justify-start">
              {/* Text content box */}
              <div className="bg-gray-900 bg-opacity-90 p-10 lg:p-16 rounded-2xl max-w-2xl">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 uppercase">
                  Machine Control Modeling
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Transform your engineering plans into precise 3D models.
                  We handle the modeling so your operators can focus on moving dirt.
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
          <div className="max-w-5xl mx-auto mb-24">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Commercial</h4>
                <p className="text-gray-400 text-sm">Fast food to distribution centers, retail, office complexes</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Residential &<br />Mixed-Use</h4>
                <p className="text-gray-400 text-sm">Subdivisions, townhomes, condos, apartments</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Roadways &<br />Highways</h4>
                <p className="text-gray-400 text-sm">DOT projects, interstate work, private roads, municipal streets</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Specialized</h4>
                <p className="text-gray-400 text-sm">Solar farms, landfills, utility corridors, stream remediation</p>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div className="max-w-3xl mx-auto my-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          <h3 className="text-3xl font-bold text-white mb-12 text-center">Our Proven 5-Step Process</h3>

          {/* Horizontal Timeline Process */}
          <div className="relative mb-48 overflow-x-auto">
            <div className="min-w-max lg:min-w-0">
              {/* Timeline Container */}
              <div className="relative px-8 lg:px-0">
                {/* Connecting Line */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700" style={{ marginLeft: '4rem', marginRight: '4rem' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-ab-blue via-ab-blue to-orange-500"></div>
                </div>

                {/* Steps Container */}
                <div className="relative grid grid-cols-5 gap-4 lg:gap-8">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-ab-blue rounded-full border-4 border-gray-900 flex items-center justify-center z-10 shadow-xl">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <div className="mt-6 text-center">
                      <h4 className="text-lg font-bold text-ab-blue mb-2">Compare PDFs and CAD</h4>
                      <p className="text-gray-400 text-sm">Verify all design elements match</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-ab-blue rounded-full border-4 border-gray-900 flex items-center justify-center z-10 shadow-xl">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <div className="mt-6 text-center">
                      <h4 className="text-lg font-bold text-ab-blue mb-2">Data Cleanup</h4>
                      <p className="text-gray-400 text-sm">Isolate what matters</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-ab-blue rounded-full border-4 border-gray-900 flex items-center justify-center z-10 shadow-xl">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <div className="mt-6 text-center">
                      <h4 className="text-lg font-bold text-ab-blue mb-2">Surface Creation</h4>
                      <p className="text-gray-400 text-sm">Build your 3D model</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-ab-blue rounded-full border-4 border-gray-900 flex items-center justify-center z-10 shadow-xl">
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                    <div className="mt-6 text-center">
                      <h4 className="text-lg font-bold text-ab-blue mb-2">Quality Control</h4>
                      <p className="text-gray-400 text-sm">Double-check everything</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full border-4 border-gray-900 flex items-center justify-center z-10 shadow-xl">
                      <span className="text-white font-bold text-2xl">✓</span>
                    </div>
                    <div className="mt-6 text-center">
                      <h4 className="text-lg font-bold text-orange-500 mb-2">Expert Review & Send</h4>
                      <p className="text-gray-400 text-sm">Final validation by senior modeler</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 mb-16">
            {/* Bad Models Section */}
            <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6">
              <h3 className="text-2xl font-bold text-white mb-4">The Real Cost of Bad Models</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Bad models don't just waste time—they destroy budgets. Rework, wasted material, change orders, idle equipment. We catch these problems in the office where fixes cost nothing, not in the field where they cost thousands.</p>
              <p className="text-lg font-semibold text-white">Your equipment investment only pays off with good data. We deliver it.</p>
            </div>

            {/* Ready to Build Better Section */}
            <div className="bg-gray-800 bg-opacity-30 border-l-4 border-orange-500 p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Build Better?</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Stop fighting bad models. Start running accurate data that keeps your projects on schedule and on grade.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href='/pricing'} className="bg-ab-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors">View Pricing</button>
                <button onClick={() => window.location.href='/service-request'} className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">Get a Quote</button>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center border-t border-gray-700 pt-12">
            <p className="text-lg text-gray-300">Have questions?</p>
            <p className="text-xl mt-2">
              <a href="tel:9315383026" className="text-white hover:text-ab-blue font-semibold">(931) 538-3026</a>
              <span className="text-gray-500 mx-3">•</span>
              <a href="mailto:info@ab-civil.com" className="text-white hover:text-ab-blue font-semibold">info@ab-civil.com</a>
            </p>
            <p className="text-gray-400 mt-3">Talk directly with a model builder who understands your project</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default MachineControlPage;