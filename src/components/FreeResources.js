import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function FreeResources() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mt-8">
        <Navigation />
      </div>

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Free Training & Tools for Trimble Users</h1>
          <p className="text-xl text-gray-300">Professional resources to help you get the most from your machine control equipment</p>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Course Connect</h2>
              <h3 className="text-xl font-semibold text-blue-400 mb-6">The Only Free Trimble Training App</h3>
              <p className="text-gray-300 mb-6">Your complete mobile reference for Trimble machine control. Access over 100 training videos we've created, organized in one dedicated app - no more hunting through YouTube or dealer sites.</p>

              <h4 className="text-lg font-semibold text-white mb-3">What's Included:</h4>
              <ul className="text-gray-300 space-y-2 ml-6 list-disc">
                <li>Step-by-step Trimble Siteworks tutorials</li>
                <li>Trimble Earthworks operation guides</li>
                <li>Quick 3-4 minute videos for fast field answers</li>
                <li>Longer deep-dive versions explaining the "why"</li>
                <li>Troubleshooting for common issues</li>
                <li>Best practices and daily operation tips</li>
                <li>Community forum - Ask questions and get answers from AB Civil experts and other operators</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-3 mt-6">Why It's Different:</h4>
              <p className="text-gray-300 mb-4">The only free, comprehensive Trimble training resource in a standalone app. No subscriptions, no scattered YouTube searches - just organized, professional training and community support at your fingertips.</p>

              <p className="text-gray-300 mb-6"><strong className="text-white">Perfect for:</strong> Operators, grade checkers, and foremen who need reliable answers in the field.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href='#'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Download for iOS</button>
                <button onClick={() => window.location.href='#'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Download for Android</button>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Model Building Mastery</h2>
              <h3 className="text-xl font-semibold text-blue-400 mb-6">Free Professional TBC Training Course</h3>
              <p className="text-gray-300 mb-6">Learn to build 3D machine control models using Trimble Business Center - exactly how we do it at AB Civil. Over 9 hours of comprehensive, step-by-step training that takes you from zero experience to professional model building.</p>

              <h4 className="text-lg font-semibold text-white mb-3">What You'll Learn:</h4>
              <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-6">
                <li>How to read construction plans (even with no experience)</li>
                <li>Complete Trimble Business Center workflows</li>
                <li>Professional model building techniques from start to finish</li>
                <li>Data prep, cleanup, and organization</li>
                <li>Surface creation and verification</li>
                <li>Every step of our proven process - nothing skipped</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-3">Who It's For:</h4>
              <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-6">
                <li>Anyone interested in learning a high-demand technical skill</li>
                <li>Existing modelers wanting to learn professional methods</li>
                <li>Tech-minded people looking for a career in construction technology</li>
                <li>Contractors considering bringing modeling in-house</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-3">Course Details:</h4>
              <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-6">
                <li>9+ hours of self-paced video content</li>
                <li>Entry-level friendly - no experience required</li>
                <li>Learn the exact methods we use on hundreds of projects</li>
                <li>Requires Trimble Business Center (30-day free trial available)</li>
              </ul>

              <button onClick={() => window.location.href='#'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Request Course Access</button>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Why We Offer Free Training</h2>
            <p className="text-gray-300 mb-4">
              We believe the entire industry benefits when operators and model builders have the skills they need.
              Better training means fewer mistakes, faster projects, and more profitable jobs for everyone.
            </p>
            <p className="text-gray-300">
              These free resources complement our modeling and support services. While you're learning and growing
              your capabilities, we're here when you need professional models, takeoffs, or expert support.
            </p>
          </div>

          <div className="text-center bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Need More Than Training?</h2>
            <p className="text-gray-300 mb-6">Get professional models and support from our experienced team.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.location.href='/services'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">View Our Services</button>
              <button onClick={() => window.location.href='/service-request'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Request a Model</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default FreeResources;