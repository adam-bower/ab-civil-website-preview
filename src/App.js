import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SemanticHomepage from './components/SemanticHomepage';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import FreeResources from './components/FreeResources';
import GetStarted from './pages/GetStarted';
import ClientIntake from './pages/ClientIntake';
import ServiceRequest from './pages/ServiceRequest';
import ContactPage from './components/ContactPage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SemanticHomepage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/free-resources" element={<FreeResources />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/client-intake" element={<ClientIntake />} />
          <Route path="/service-request" element={<ServiceRequest />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;