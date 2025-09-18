import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function AppPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Connect</h1>
          <p className="text-xl text-gray-300">The Only Free Trimble Training App</p>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
            <p className="text-gray-300 mb-6 text-lg">Your complete mobile reference for Trimble machine control. Access over 100 training videos we've created, organized in one dedicated app - no more hunting through YouTube or dealer sites.</p>

            <h2 className="text-2xl font-bold text-white mb-4">What's Included:</h2>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-8">
              <li>Step-by-step Trimble Siteworks tutorials</li>
              <li>Trimble Earthworks operation guides</li>
              <li>Quick 3-4 minute videos for fast field answers</li>
              <li>Longer deep-dive versions explaining the "why"</li>
              <li>Troubleshooting for common issues</li>
              <li>Best practices and daily operation tips</li>
              <li>Community forum - Ask questions and get answers from AB Civil experts and other operators</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">Why It's Different:</h2>
            <p className="text-gray-300 mb-6">The only free, comprehensive Trimble training resource in a standalone app. No subscriptions, no scattered YouTube searches - just organized, professional training and community support at your fingertips.</p>

            <div className="bg-blue-900 bg-opacity-20 border-l-4 border-ab-blue p-6 mb-8">
              <p className="text-gray-300"><strong className="text-white">Perfect for:</strong> Operators, grade checkers, and foremen who need reliable answers in the field.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://apps.apple.com/app/course-connect" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold">
                Download for iOS
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.courseconnect" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold">
                Download for Android
              </a>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Join the Community</h2>
            <p className="text-gray-300 mb-6">
              Connect with other Trimble users, ask questions, and share knowledge. Our experts and community members are ready to help you solve problems and improve your skills.
            </p>
            <a href="https://courseconnect.thinkific.com" target="_blank" rel="noopener noreferrer" className="bg-ab-blue text-white py-3 px-8 rounded-lg hover:bg-ab-blue-dark transition-colors inline-block font-semibold">
              Visit Course Connect Platform
            </a>
          </div>

          <div className="text-center bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Need Professional Support?</h2>
            <p className="text-gray-300 mb-6">While Course Connect provides free training, sometimes you need immediate expert help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.location.href='/services#remote-support'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                View Support Plans
              </button>
              <button onClick={() => window.location.href='/service-request'} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Request Help
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AppPage;