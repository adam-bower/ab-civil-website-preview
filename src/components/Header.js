import React from 'react';
import logo from '../assets/logo.png';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/">
              <img src={logo} alt="AB Civil" className="h-10 w-auto" />
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/services" className="text-gray-700 hover:text-ab-blue transition-colors">Services</a>
            <a href="/pricing" className="text-gray-700 hover:text-ab-blue transition-colors">Pricing</a>
            <a href="/about" className="text-gray-700 hover:text-ab-blue transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-ab-blue transition-colors">Contact</a>
            <a href="/get-started" className="bg-ab-blue text-white px-4 py-2 rounded-lg hover:bg-ab-blue-dark transition-colors">Get Started</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;