import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SemanticHomepage from './components/SemanticHomepage';
import ServicesPage from './components/ServicesPage';
import MachineControlPage from './components/MachineControlPage';
import TakeoffsPage from './components/TakeoffsPage';
import RemoteSupportPage from './components/RemoteSupportPage';
import AboutPage from './components/AboutPage';
import CareersPage from './components/CareersPage';
import PricingPage from './components/PricingPage';
import FreeResources from './components/FreeResources';
import AppPage from './components/AppPage';
import ModelBuildingCoursePage from './components/ModelBuildingCoursePage';
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
          <Route path="/services/machine-control" element={<MachineControlPage />} />
          <Route path="/services/takeoffs" element={<TakeoffsPage />} />
          <Route path="/services/remote-support" element={<RemoteSupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/free-resources" element={<FreeResources />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/model-building-course" element={<ModelBuildingCoursePage />} />
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