import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ClientIntakeForm from '../shared/components/forms/ClientIntakeForm/ClientIntakeForm';

function ClientIntake() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mt-8">
        <Navigation />
      </div>

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Client Intake Form</h1>
          <p className="text-xl text-gray-300">Tell us about your project and requirements</p>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
            <ClientIntakeForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ClientIntake;