import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to section if hash is present
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About AB Civil</h1>
          <p className="text-xl text-gray-300">Turning Plans into Precision</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Who We Are</h2>
          <p className="text-gray-300 text-lg">
            AB Civil builds 3D machine control models that keep contractors moving. Since 2019, we've delivered hundreds of projects a year—everything from small commercial pads to 100-acre subdivisions and major infrastructure.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Approach: Built Like a Crew</h2>
          <p className="text-gray-300 mb-4">We run our modeling team the way great contractors run their crews—balanced, efficient, and field-ready.</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Senior modelers tackle the complex designs.</li>
            <li>Specialists handle prep and quality checks.</li>
            <li>Every project gets multiple reviews and fast starts, so errors get caught early.</li>
          </ul>
          <p className="text-gray-300">The result? Models that are more accurate, more reliable, and more cost-effective.</p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">More Than Model Builders</h2>
          <p className="text-gray-300 mb-4">We're not just sending surfaces and walking away. We're technology partners. That means:</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Pushing every feature your machines can do—not just the basics.</li>
            <li>Building models that anticipate field challenges before they cost you money.</li>
            <li>Supporting Trimble users with our own training platform, Course Connect, packed with 100+ videos and remote support subscriptions.</li>
          </ul>
          <p className="text-gray-300">Because knowing how to use your gear is just as important as having the right model.</p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Investing in People, Delivering Quality</h2>
          <p className="text-gray-300">
            We train our people the same way we build models—thoroughly. Every specialist develops through a structured training program, so every client gets a skilled, invested team. That investment in people shows up directly in the precision of your project.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Moving Forward</h2>
          <p className="text-gray-300 mb-4">
            Every model, every early catch, every support call—it's all about one thing: helping contractors get the most out of their equipment and their crews.
          </p>
          <p className="text-gray-300">
            When you work with AB Civil, you're not just getting a model. You're getting a partner who's as invested in your success as you are.
          </p>
        </div>

        <div className="mb-16" id="team">
          <h2 className="text-3xl font-bold text-white mb-8">Our Team</h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Adam Bower</h3>
              <p className="text-gray-400">Owner</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Devin Bower</h3>
              <p className="text-gray-400">Owner & Human Resources</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Matt Cole</h3>
              <p className="text-gray-400">Operations Manager</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Adam Boyte</h3>
              <p className="text-gray-400">Model Builder</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Stef Quibete</h3>
              <p className="text-gray-400">Model Builder & Quality Control</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Zach Breth</h3>
              <p className="text-gray-400">Model Builder & Utilities Specialist</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Dustin Ellis</h3>
              <p className="text-gray-400">Data Preparation Specialist</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Austin Holt</h3>
              <p className="text-gray-400">Remote Support & Quality Control</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Linda Grady</h3>
              <p className="text-gray-400">Administrator</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500">
                [Photo]
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Heath Boyte</h3>
              <p className="text-gray-400">Systems & Automation Specialist</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;