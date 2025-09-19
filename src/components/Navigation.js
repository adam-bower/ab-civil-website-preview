import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-white.png';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Utility Bar */}
      <div className="bg-gray-900 border-b border-gray-700" style={{backgroundColor: '#18191e'}}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-end h-10 text-sm">
            {/* Right side - Forms and Client access */}
            <div className="flex items-center space-x-3">
              <Link to="/service-request" className="text-white hover:text-ab-blue px-3 py-1 border border-ab-blue rounded-full transition-colors font-medium">
                Request Form
              </Link>
              <Link to="/client-portal" className="text-white hover:text-ab-blue px-3 py-1 border border-ab-blue rounded-full transition-colors font-medium">
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-gradient-to-t from-gray-800 to-gray-900 relative z-50 border-b-2 border-gray-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center ml-2 md:ml-4 lg:ml-8">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="AB Civil" className="h-10 lg:h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-2 lg:space-x-6 xl:space-x-8 mr-4 lg:mr-8">
            {/* Services Dropdown */}
            <div className="relative group">
              <Link
                to="/services"
                className="text-white hover:text-ab-blue py-2 flex items-center text-lg uppercase tracking-wider font-semibold transition-colors"
              >
                Services
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                <Link to="/services/machine-control" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Machine Control Modeling
                </Link>
                <Link to="/services/takeoffs" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Takeoffs
                </Link>
                <Link to="/services/remote-support" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Remote Support
                </Link>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group">
              <Link
                to="/about"
                className="text-white hover:text-ab-blue py-2 flex items-center text-lg uppercase tracking-wider font-semibold transition-colors"
              >
                About
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                <Link to="/about" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Why AB Civil
                </Link>
                <Link to="/about#team" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Our Team
                </Link>
                <Link to="/careers" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Careers
                </Link>
              </div>
            </div>

            {/* Pricing */}
            <Link
              to="/pricing"
              className="text-white hover:text-ab-blue py-2 text-lg uppercase tracking-wider font-semibold transition-colors"
            >
              Pricing
            </Link>

            {/* Training Dropdown */}
            <div className="relative group">
              <Link
                to="/free-resources"
                className="text-white hover:text-ab-blue py-2 flex items-center text-lg uppercase tracking-wider font-semibold transition-colors"
              >
                Training
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-700">
                <Link to="/app" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Course Connect App
                </Link>
                <Link to="/model-building-course" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Model Building Course
                </Link>
              </div>
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              className="text-white hover:text-ab-blue py-2 text-lg uppercase tracking-wider font-semibold transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="block md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-ab-blue p-2 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-1">
              <div className="border-b border-gray-700 pb-2 mb-2">
                <p className="text-gray-400 text-xs uppercase tracking-wider px-4 py-2">Services</p>
                <Link to="/services/machine-control" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  Machine Control Modeling
                </Link>
                <Link to="/services/takeoffs" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  Takeoffs
                </Link>
                <Link to="/services/remote-support" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  Remote Support
                </Link>
              </div>
              <Link to="/about" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                About
              </Link>
              <Link to="/pricing" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                Pricing
              </Link>
              <div className="border-b border-gray-700 pb-2 mb-2">
                <p className="text-gray-400 text-xs uppercase tracking-wider px-4 py-2">Resources</p>
                <Link to="/app" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  Course Connect App
                </Link>
                <Link to="/model-building-course" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  Model Building Course
                </Link>
              </div>
              <Link to="/contact" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                Contact
              </Link>
              <Link to="/service-request" className="block mx-4 mt-4 px-4 py-3 bg-ab-blue text-white text-center text-sm uppercase tracking-wider font-bold rounded shadow-lg">
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

export default Navigation;