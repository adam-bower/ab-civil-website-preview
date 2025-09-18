import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mt-8">
        <Navigation />
      </div>

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
          <p className="text-gray-400 mb-6">Effective Date: January 1, 2024</p>

          <div className="space-y-8 text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using AB Civil's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Services Description</h2>
              <p className="mb-4">AB Civil provides machine control modeling, quantity takeoff, and remote support services for construction and civil engineering projects. Our services include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>3D machine control model creation from engineering plans</li>
                <li>Material quantity takeoffs and earthwork calculations</li>
                <li>Remote technical support for Trimble systems</li>
                <li>Training and educational resources</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <p className="mb-4">When using our services, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete engineering plans and project information</li>
                <li>Verify all models and calculations before field implementation</li>
                <li>Maintain appropriate licenses for any software used</li>
                <li>Use our services only for lawful purposes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
              <p>All models, calculations, and deliverables created by AB Civil remain the intellectual property of the client upon full payment. AB Civil retains the right to use anonymized project data for improving our services and training purposes.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Accuracy and Limitations</h2>
              <p className="mb-4">While we strive for accuracy in all our work:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Models are based on provided engineering plans and may require field verification</li>
                <li>AB Civil is not responsible for errors in source engineering documents</li>
                <li>Final field implementation remains the responsibility of the contractor</li>
                <li>We recommend quality checking all models before use</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Payment Terms</h2>
              <p className="mb-4">Payment terms for our services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pricing is provided via our online calculator or custom quotes</li>
                <li>Payment is due upon receipt unless other terms are agreed upon</li>
                <li>Rush services may incur additional fees</li>
                <li>We accept major credit cards, ACH transfers, and checks</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Confidentiality</h2>
              <p>AB Civil treats all client project information as confidential. We will not share your project details, plans, or specifications with third parties without your express permission, except as required by law.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p>AB Civil's liability for any claim arising from our services shall not exceed the amount paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages including lost profits or project delays.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Indemnification</h2>
              <p>You agree to indemnify and hold harmless AB Civil, its officers, employees, and agents from any claims, damages, or expenses arising from your use of our models or services, including any field implementation decisions.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p>Either party may terminate services with written notice. Upon termination, all outstanding payments become due immediately. Completed work will be delivered upon full payment.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
              <p>These terms shall be governed by the laws of the State of Tennessee. Any disputes shall be resolved in the courts of Montgomery County, Tennessee.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Modifications</h2>
              <p>AB Civil reserves the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
              <p className="mb-4">For questions about these Terms of Service, please contact us at:</p>
              <div className="bg-gray-700 rounded-lg p-4">
                <p>AB Civil</p>
                <p>420 Madison St. B2</p>
                <p>Clarksville, TN 37040</p>
                <p>Email: info@ab-civil.com</p>
                <p>Phone: (931) 538-3026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TermsOfService;