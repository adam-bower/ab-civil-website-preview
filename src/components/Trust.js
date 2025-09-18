import React from 'react';
import './Trust.css';

function Trust() {
  return (
    <section className="trust-section">
      <div className="container">
        <h2 className="section-title">Why Trust AB Civil</h2>
        
        <div className="trust-grid">
          <div className="trust-item">
            <h3>Radical Transparency</h3>
            <p>
              We're opening our internal project communications to clients. 
              See exactly what we're working on, when we're working on it. 
              No black boxes, no surprises.
            </p>
          </div>
          
          <div className="trust-item">
            <h3>Systematic Process</h3>
            <p>
              Every model goes through multiple quality checks. 
              Two independent reviews ensure accuracy before anything 
              reaches your machine.
            </p>
          </div>
          
          <div className="trust-item">
            <h3>Industry Partnership</h3>
            <p>
              Trusted by leading equipment dealers who recommend us to 
              their clients. When accuracy matters, professionals 
              choose AB Civil.
            </p>
          </div>
        </div>
        
        <div className="trust-statement">
          <h3>Built on Trust</h3>
          <p>
            You're placing your project timeline and budget in our hands 
            with a product you can't technically verify. We understand 
            that responsibility.
          </p>
          <p className="trust-stats">
            With over 1,400 successful projects, we've earned the trust of 
            excavation contractors across the country.
          </p>
        </div>
        
        <div className="pricing-callout">
          <h3>Transparent Pricing</h3>
          <p>
            No hidden fees, no surprise charges. Our per-acre pricing 
            is public because transparency starts before you're even a client.
          </p>
          <a href="#pricing" className="pricing-link">View Pricing →</a>
        </div>
      </div>
    </section>
  );
}

export default Trust;