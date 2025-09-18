import React, { useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { supabase } from '../shared/lib/supabase';
import {
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  generateSecureId,
  validateFormData
} from '../shared/utils/security';

function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    location: '',
    linkedin: '',
    message: '',
    resume: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const positions = [
    'Select Position of Interest',
    '3D Modeler',
    'Project Manager',
    'Support Specialist',
    'Sales Representative',
    'Other'
  ];

  const experienceLevels = [
    'Select Experience Level',
    'Entry Level (0-2 years)',
    'Mid-Level (3-5 years)',
    'Senior Level (6+ years)'
  ];

  const locationPreferences = [
    'Select Location Preference',
    'Remote Only',
    'Hybrid',
    'On-site',
    'Open to Any'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resume: 'Please upload a PDF or Word document'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          resume: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file
      }));

      if (errors.resume) {
        setErrors(prev => ({
          ...prev,
          resume: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.position || formData.position === positions[0]) {
      newErrors.position = 'Please select a position';
    }
    if (!formData.experience || formData.experience === experienceLevels[0]) {
      newErrors.experience = 'Please select experience level';
    }
    if (!formData.location || formData.location === locationPreferences[0]) {
      newErrors.location = 'Please select location preference';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us about yourself and your interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Generate unique ID
      const applicationId = generateSecureId();

      // Upload resume if provided
      let resumeUrl = null;
      if (formData.resume) {
        const fileName = `${applicationId}-${formData.resume.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('career-applications')
          .upload(fileName, formData.resume);

        if (uploadError) throw uploadError;
        resumeUrl = uploadData.path;
      }

      // Submit to database
      const { error } = await supabase
        .from('career_applications')
        .insert([
          {
            id: applicationId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            experience_level: formData.experience,
            location_preference: formData.location,
            linkedin_profile: formData.linkedin,
            message: formData.message,
            resume_url: resumeUrl,
            submitted_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        location: '',
        linkedin: '',
        message: '',
        resume: null
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-green-900 bg-opacity-20 border-l-4 border-green-400 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
            <p className="text-gray-300">
              Thank you for your interest in joining AB Civil. We've received your application and will review it carefully.
              We'll be in touch if there's a good fit for current or future opportunities.
            </p>
          </div>
          <button
            onClick={() => setSubmitStatus(null)}
            className="bg-ab-blue text-white px-6 py-2 rounded hover:bg-ab-blue-dark transition-colors"
          >
            Submit Another Application
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-300">Help us build the models that keep contractors moving</p>
        </div>
      </section>

      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - About Working Here */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Why AB Civil?</h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-ab-blue mb-3">Our Culture</h3>
              <p className="text-gray-300 mb-4">
                We operate like a well-run construction crew—efficient, professional, and focused on quality.
                Our team works remotely but stays connected, delivering hundreds of projects yearly with precision and reliability.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-ab-blue mb-3">What We Offer</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Competitive compensation</li>
                <li>• Flexible remote work environment</li>
                <li>• Professional development opportunities</li>
                <li>• Work with cutting-edge 3D modeling technology</li>
                <li>• Be part of an essential service to the construction industry</li>
                <li>• Collaborative team focused on continuous improvement</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Current Openings</h3>
              <p className="text-gray-300 mb-4">
                We don't hire frequently, but we're always interested in connecting with talented professionals
                who share our commitment to precision and quality.
              </p>
              <p className="text-ab-blue font-semibold">
                No current openings, but we encourage you to submit your information for future opportunities.
              </p>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Express Your Interest</h2>

            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              {submitStatus === 'error' && (
                <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-400 p-4 mb-6">
                  <p className="text-red-300">
                    There was an error submitting your application. Please try again.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                    required
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                    required
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                  required
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Position of Interest *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border ${errors.position ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                    required
                  >
                    {positions.map((pos, index) => (
                      <option key={index} value={pos} disabled={index === 0}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  {errors.position && <p className="text-red-400 text-sm mt-1">{errors.position}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Experience Level *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border ${errors.experience ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                    required
                  >
                    {experienceLevels.map((level, index) => (
                      <option key={index} value={level} disabled={index === 0}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location Preference *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${errors.location ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                  required
                >
                  {locationPreferences.map((pref, index) => (
                    <option key={index} value={pref} disabled={index === 0}>
                      {pref}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-ab-blue"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Resume (PDF or Word, max 5MB)
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-ab-blue file:text-white hover:file:bg-ab-blue-dark"
                />
                {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Tell us about yourself and your interest in AB Civil *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-3 py-2 bg-gray-700 border ${errors.message ? 'border-red-500' : 'border-gray-600'} rounded text-white focus:outline-none focus:border-ab-blue`}
                  placeholder="Share your background, relevant experience, and what interests you about working with AB Civil..."
                  required
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-ab-blue text-white py-3 px-6 rounded font-semibold hover:bg-ab-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CareersPage;