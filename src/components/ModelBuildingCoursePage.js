import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function ModelBuildingCoursePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Model Building Mastery</h1>
          <p className="text-xl text-gray-300">Free Professional TBC Training Course</p>
        </div>
      </section>

      <section className="py-8 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
            <p className="text-gray-300 mb-8 text-lg">Learn to build 3D machine control models using Trimble Business Center - exactly how we do it at AB Civil. Over 9 hours of comprehensive, step-by-step training that takes you from zero experience to professional model building.</p>

            <h2 className="text-2xl font-bold text-white mb-4">What You'll Learn:</h2>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-8">
              <li>How to read construction plans (even with no experience)</li>
              <li>Complete Trimble Business Center workflows</li>
              <li>Professional model building techniques from start to finish</li>
              <li>Data prep, cleanup, and organization</li>
              <li>Surface creation and verification</li>
              <li>Every step of our proven process - nothing skipped</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">Who It's For:</h2>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-8">
              <li>Anyone interested in learning a high-demand technical skill</li>
              <li>Existing modelers wanting to learn professional methods</li>
              <li>Tech-minded people looking for a career in construction technology</li>
              <li>Contractors considering bringing modeling in-house</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">Course Details:</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Duration</h3>
                <p className="text-gray-300">9+ hours of self-paced video content</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Requirements</h3>
                <p className="text-gray-300">Trimble Business Center (30-day free trial available)</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Experience Level</h3>
                <p className="text-gray-300">Entry-level friendly - no experience required</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Teaching Method</h3>
                <p className="text-gray-300">Exact methods used on hundreds of real projects</p>
              </div>
            </div>

            <div className="text-center">
              <button onClick={() => window.location.href='/service-request'} className="bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                Request Free Course Access
              </button>
              <p className="text-gray-400 mt-3">Instant access • No credit card required</p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Why We Offer This Free</h2>
            <p className="text-gray-300 mb-4">
              We believe the entire industry benefits when model builders have the skills they need.
              Better training means fewer mistakes, faster projects, and more profitable jobs for everyone.
            </p>
            <p className="text-gray-300">
              This free course complements our modeling services. While you're learning and growing
              your capabilities, we're here when you need professional models, takeoffs, or expert support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Need a Model Now?</h3>
              <p className="text-gray-300 mb-4">Can't wait to learn? We'll build it for you.</p>
              <button onClick={() => window.location.href='/services'} className="bg-ab-blue text-white py-2 px-6 rounded-lg hover:bg-ab-blue-dark transition-colors">
                View Modeling Services
              </button>
            </div>
            <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Want Personal Training?</h3>
              <p className="text-gray-300 mb-4">Get 1-on-1 remote support and training.</p>
              <button onClick={() => window.location.href='/services#remote-support'} className="bg-ab-blue text-white py-2 px-6 rounded-lg hover:bg-ab-blue-dark transition-colors">
                View Support Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ModelBuildingCoursePage;