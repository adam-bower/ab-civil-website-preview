import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
          <p className="text-gray-400 mb-6">Effective Date: January 1, 2024</p>
          <p className="text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>AB Civil ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our services or visit our website.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p className="mb-4">We collect several types of information from and about users of our services:</p>

              <h3 className="text-lg font-semibold text-white mb-2 ml-4">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-8 mb-4">
                <li>Name and job title</li>
                <li>Company name and address</li>
                <li>Email address and phone number</li>
                <li>Billing and payment information</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-2 ml-4">Project Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-8 mb-4">
                <li>Engineering plans and specifications</li>
                <li>Project locations and details</li>
                <li>Machine control system specifications</li>
                <li>Communication regarding projects</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-2 ml-4">Technical Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-8">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our modeling and support services</li>
                <li>Process payments and manage accounts</li>
                <li>Communicate about projects and services</li>
                <li>Send updates about new features or services</li>
                <li>Comply with legal obligations</li>
                <li>Protect against fraud and unauthorized use</li>
                <li>Analyze and improve our business operations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">We do not sell or rent your personal information. We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Third parties who help us operate our business (e.g., payment processors, cloud storage)</li>
                <li><strong>Business Partners:</strong> With your consent, to provide integrated services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger or sale of our business</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="mb-4">We implement appropriate technical and organizational measures to protect your data, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
                <li>Secure data backup and recovery procedures</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Project files are typically retained for 5 years after completion unless you request earlier deletion.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
                <li>Object to certain processing activities</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@ab-civil.com</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences</li>
                <li>Understand how you use our website</li>
                <li>Improve our services</li>
                <li>Provide relevant content</li>
              </ul>
              <p className="mt-4">You can control cookies through your browser settings, but disabling cookies may limit some features of our website.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Third-Party Services</h2>
              <p>Our services may integrate with third-party platforms like Trimble Connect, Autodesk, and others. These services have their own privacy policies, and we encourage you to review them.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">11. California Privacy Rights</h2>
              <p>California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and the right to request deletion. To exercise these rights, contact us using the information below.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">12. International Data Transfers</h2>
              <p>We are based in the United States. If you are accessing our services from outside the US, please be aware that your information will be transferred to and processed in the United States.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
              <p className="mb-4">If you have questions about this privacy policy or our privacy practices, please contact us at:</p>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="font-semibold mb-2">AB Civil Privacy Team</p>
                <p>420 Madison St. B2</p>
                <p>Clarksville, TN 37040</p>
                <p className="mt-2">Email: privacy@ab-civil.com</p>
                <p>Phone: (931) 538-3026</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                This privacy policy is provided for informational purposes and constitutes our commitment to protecting your privacy. By using our services, you acknowledge that you have read and understood this policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;