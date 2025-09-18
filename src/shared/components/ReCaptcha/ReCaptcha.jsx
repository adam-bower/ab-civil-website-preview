import React, { useEffect, useCallback, useRef } from 'react';

/**
 * Google reCAPTCHA v3 Component
 * Provides invisible bot protection for forms
 */
const ReCaptcha = ({ 
  action = 'submit', 
  onVerify, 
  siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY 
}) => {
  const isLoadedRef = useRef(false);
  const scriptIdRef = useRef('recaptcha-script');

  // Load reCAPTCHA script
  useEffect(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not provided. Skipping reCAPTCHA initialization.');
      return;
    }

    // Check if script is already loaded
    const existingScript = document.getElementById(scriptIdRef.current);
    if (existingScript) {
      isLoadedRef.current = true;
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.id = scriptIdRef.current;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isLoadedRef.current = true;
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Don't remove the script as it might be used by other components
    };
  }, [siteKey]);

  // Execute reCAPTCHA
  const execute = useCallback(async () => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not provided');
      return null;
    }

    if (!isLoadedRef.current || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      
      if (onVerify) {
        onVerify(token);
      }
      
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  }, [siteKey, action, onVerify]);

  return { execute };
};

/**
 * Hook for using reCAPTCHA in forms
 */
export const useReCaptcha = (action = 'submit') => {
  const [token, setToken] = React.useState(null);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  const verify = useCallback(async () => {
    if (!siteKey) {
      console.warn('reCAPTCHA not configured - skipping verification');
      return 'recaptcha-not-configured';
    }

    setIsVerifying(true);
    
    try {
      // Wait for grecaptcha to be available
      let attempts = 0;
      while (!window.grecaptcha && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.grecaptcha) {
        console.error('reCAPTCHA failed to load');
        return null;
      }

      // Execute reCAPTCHA
      const newToken = await window.grecaptcha.execute(siteKey, { action });
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      return null;
    } finally {
      setIsVerifying(false);
    }
  }, [siteKey, action]);

  // Load reCAPTCHA script on mount
  useEffect(() => {
    if (!siteKey) return;

    const scriptId = 'recaptcha-script';
    const existingScript = document.getElementById(scriptId);
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [siteKey]);

  return { verify, token, isVerifying };
};

/**
 * Server-side verification helper
 * This should be called from your backend API
 */
export const verifyReCaptchaToken = async (token, secretKey) => {
  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  
  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    
    // Check if verification was successful and score is acceptable
    // Score of 0.5 or higher is typically considered legitimate
    return {
      success: data.success && data.score >= 0.5,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      errorCodes: data['error-codes']
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default ReCaptcha;