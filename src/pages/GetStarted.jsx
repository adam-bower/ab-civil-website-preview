import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import './GetStarted.css';

const GetStarted = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');

  const handleStepClick = (step) => {
    setActiveStep(activeStep === step ? null : step);
  };

  const openRequestForm = (type = '') => {
    setFormType(type);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormType('');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mt-8">
        <Navigation />
      </div>
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Get Started with AB Civil</h1>
          <p className="text-xl text-gray-300">
            Professional 3D modeling and takeoff services for your construction projects
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white text-xl font-bold rounded-full mb-4">1</div>
              <h3 className="text-xl font-semibold text-white mb-3">Submit Your Request</h3>
              <p className="text-gray-300">Fill out our request form with your project details and requirements</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white text-xl font-bold rounded-full mb-4">2</div>
              <h3 className="text-xl font-semibold text-white mb-3">We Get to Work</h3>
              <p className="text-gray-300">Our team immediately starts on your 3D model or takeoff</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white text-xl font-bold rounded-full mb-4">3</div>
              <h3 className="text-xl font-semibold text-white mb-3">Receive Your Files</h3>
              <p className="text-gray-300">Get accurate deliverables on time, every time</p>
            </div>
          </div>
          <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300"><strong className="text-white">Need a quote first?</strong> Just select "Quote Only" in the request form.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Choose Your Service</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-lg p-8">
              <div className="flex justify-center mb-6">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path d="M12 2l-5.5 9h11z" fill="#3b82f6"/>
                  <circle cx="17.5" cy="17.5" r="4.5" fill="#60a5fa"/>
                  <path d="M3 13.5h8v8H3z" fill="#93c5fd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">3D Modeling</h3>
              <p className="text-gray-300 text-center mb-6">Transform your 2D plans into accurate 3D models for machine control</p>
              <ul className="text-gray-300 space-y-2 mb-8">
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Finish grade surfaces</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Utility modeling</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Erosion control surfaces</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Multiple file formats (Trimble, Topcon, Leica)</li>
              </ul>
              <button
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => openRequestForm('model')}
              >
                Submit 3D Model Request
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-lg p-8">
              <div className="flex justify-center mb-6">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h12v2H3zm0 4h8v2H3z" fill="#3b82f6"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">Takeoff Services</h3>
              <p className="text-gray-300 text-center mb-6">Accurate quantity takeoffs for bidding and project planning</p>
              <ul className="text-gray-300 space-y-2 mb-8">
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Pipe quantities (storm, sewer, water)</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Earthwork calculations</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Structure counts</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Detailed reports in Excel format</li>
              </ul>
              <button
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => openRequestForm('takeoff')}
              >
                Submit Takeoff Request
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <button
                className={`w-full text-left p-6 flex justify-between items-center text-white hover:bg-gray-700 transition-colors rounded-lg ${
                  activeStep === 'turnaround' ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleStepClick('turnaround')}
              >
                <span className="font-semibold">What's your typical turnaround time?</span>
                <span className="text-xl">{activeStep === 'turnaround' ? '−' : '+'}</span>
              </button>
              {activeStep === 'turnaround' && (
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-3">Our typical turnaround times are:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>3D Models: 2-3 business days</li>
                    <li>Takeoffs: 1-2 business days</li>
                    <li>Rush orders available for urgent projects</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <button
                className={`w-full text-left p-6 flex justify-between items-center text-white hover:bg-gray-700 transition-colors rounded-lg ${
                  activeStep === 'formats' ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleStepClick('formats')}
              >
                <span className="font-semibold">What file formats do you accept?</span>
                <span className="text-xl">{activeStep === 'formats' ? '−' : '+'}</span>
              </button>
              {activeStep === 'formats' && (
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-3">We accept most standard CAD and PDF formats:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>PDF plans (preferred)</li>
                    <li>AutoCAD (.dwg, .dxf)</li>
                    <li>Links to online plan rooms</li>
                    <li>We'll work with whatever you have!</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <button
                className={`w-full text-left p-6 flex justify-between items-center text-white hover:bg-gray-700 transition-colors rounded-lg ${
                  activeStep === 'pricing' ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleStepClick('pricing')}
              >
                <span className="font-semibold">How is pricing determined?</span>
                <span className="text-xl">{activeStep === 'pricing' ? '−' : '+'}</span>
              </button>
              {activeStep === 'pricing' && (
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-3">Pricing is based on project complexity and scope:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Project size and number of sheets</li>
                    <li>Level of detail required</li>
                    <li>Turnaround time needed</li>
                    <li>Get a custom quote within 24 hours</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <button
                className={`w-full text-left p-6 flex justify-between items-center text-white hover:bg-gray-700 transition-colors rounded-lg ${
                  activeStep === 'revisions' ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleStepClick('revisions')}
              >
                <span className="font-semibold">Do you handle revisions?</span>
                <span className="text-xl">{activeStep === 'revisions' ? '−' : '+'}</span>
              </button>
              {activeStep === 'revisions' && (
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-3">Yes! We understand plans change:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Quick turnaround on revisions</li>
                    <li>Track changes between versions</li>
                    <li>Competitive revision pricing</li>
                    <li>Priority service for existing clients</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-4xl h-3/4 mx-4 relative">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
              onClick={closeForm}
            >
              ×
            </button>
            <iframe
              src={formType ? `http://localhost:3002#${formType}` : 'http://localhost:3002'}
              title="Request Form"
              width="100%"
              height="100%"
              frameBorder="0"
              className="rounded-lg"
            />
          </div>
          <div className="fixed inset-0 bg-black bg-opacity-50 -z-10" onClick={closeForm} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GetStarted;