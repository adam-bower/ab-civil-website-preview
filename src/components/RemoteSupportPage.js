import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function RemoteSupportPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero Section with Image and Text */}
      <section
        className="relative bg-gray-900 text-white flex items-center"
        style={{
          backgroundImage: 'url(/remote-support-hero-2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        {/* Overlay for transparency */}
        <div className="absolute inset-0 bg-gray-900 opacity-30"></div>

        {/* Very subtle right edge fade */}
        <div className="absolute inset-0 bg-gradient-to-l from-gray-900/30 via-transparent via-10% to-transparent"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="px-4 lg:pr-16">
            <div className="flex justify-center lg:justify-end">
              {/* Text content box */}
              <div className="bg-gray-900 bg-opacity-90 p-10 lg:p-16 rounded-2xl max-w-2xl">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 uppercase">
                  Remote Support
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Get instant technical help for your Trimble equipment.
                  We remote in, solve problems, and keep you working—no waiting.
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
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Siteworks</h4>
                <p className="text-gray-400 text-sm">Full support for all features, settings, troubleshooting</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Earthworks</h4>
                <p className="text-gray-400 text-sm">Complete assistance with setup, operation, problem-solving</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Model<br />Management</h4>
                <p className="text-gray-400 text-sm">Help loading, organizing, and running your files correctly</p>
              </div>
              <div className="md:border-l border-gray-700 md:pl-8">
                <h4 className="text-3xl font-bold text-ab-blue mb-3">Cloud<br />Transfer</h4>
                <p className="text-gray-400 text-sm">Assistance with file uploads and downloads</p>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div className="max-w-3xl mx-auto my-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 mb-16">
            {/* Downtime Costs Section */}
            <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6">
              <h3 className="text-2xl font-bold text-ab-blue mb-4">The Real Cost of Downtime</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Every hour your machine sits idle costs money. Operators standing around, deadlines slipping, other crews waiting. Our remote support gets you back to work in minutes, not hours or days.</p>
              <p className="text-lg font-semibold text-white">When problems hit, we're your instant solution.</p>
            </div>

            {/* Ready for Support Section */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-200 mb-4">Ready for Instant Help?</h3>
              <p className="text-gray-400 mb-6">Stop losing time to tech issues. Get expert support the moment you need it.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => window.location.href='/pricing'} className="bg-ab-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ab-blue-dark transition-colors">View Support Plans</button>
                <button onClick={() => window.location.href='/service-request'} className="border-2 border-ab-blue text-ab-blue px-6 py-3 rounded-lg font-semibold hover:bg-ab-blue hover:text-white transition-colors">Get Started</button>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400">
            <p>Need support now? Call us at <a href="tel:9315383026" className="text-ab-blue hover:text-ab-blue-dark">(931) 538-3026</a> or email <a href="mailto:support@ab-civil.com" className="text-ab-blue hover:text-ab-blue-dark">support@ab-civil.com</a>—we remote in and solve problems while you wait.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RemoteSupportPage;