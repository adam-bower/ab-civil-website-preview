/**
 * Security Headers Configuration
 * These headers help protect against common web vulnerabilities
 */

/**
 * Content Security Policy (CSP) configuration
 * Helps prevent XSS, clickjacking, and other injection attacks
 */
export const getCSPHeader = (nonce = '') => {
  const policies = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      nonce ? `'nonce-${nonce}'` : "'unsafe-inline'", // Use nonce when available
      'https://db.ab-civil.com',
      'https://*.supabase.co',
      'https://*.supabase.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for React inline styles
      'https://fonts.googleapis.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://db.ab-civil.com',
      'https://*.supabase.co',
      'https://*.supabase.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com'
    ],
    'connect-src': [
      "'self'",
      'https://db.ab-civil.com',
      'https://*.supabase.co',
      'https://*.supabase.com',
      'wss://*.supabase.co',
      'wss://*.supabase.com'
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': [
      "'self'",
      'https://*.wix.com', // Allow Wix embedding
      'https://*.wixsite.com' // Allow Wix sites
    ],
    'upgrade-insecure-requests': []
  };

  return Object.entries(policies)
    .map(([directive, values]) => 
      values.length > 0 ? `${directive} ${values.join(' ')}` : directive
    )
    .join('; ');
};

/**
 * Get all security headers
 * @param {Object} options - Configuration options
 * @returns {Object} Headers object
 */
export const getSecurityHeaders = (options = {}) => {
  const {
    allowIframe = true, // Allow iframe embedding (for Wix)
    cspNonce = '',
    enableHSTS = true,
    enableNoSniff = true,
    enableXSSProtection = true
  } = options;

  const headers = {};

  // Content Security Policy
  headers['Content-Security-Policy'] = getCSPHeader(cspNonce);

  // X-Frame-Options (if not allowing iframe)
  if (!allowIframe) {
    headers['X-Frame-Options'] = 'SAMEORIGIN';
  }

  // X-Content-Type-Options
  if (enableNoSniff) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }

  // X-XSS-Protection (for older browsers)
  if (enableXSSProtection) {
    headers['X-XSS-Protection'] = '1; mode=block';
  }

  // Strict-Transport-Security (HSTS)
  if (enableHSTS) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  // Referrer Policy
  headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';

  // Permissions Policy (formerly Feature Policy)
  headers['Permissions-Policy'] = 'geolocation=(), camera=(), microphone=()';

  return headers;
};

/**
 * Apply security headers to Express app
 * @param {Object} app - Express app instance
 * @param {Object} options - Configuration options
 */
export const applySecurityHeaders = (app, options = {}) => {
  app.use((req, res, next) => {
    const headers = getSecurityHeaders(options);
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    next();
  });
};

/**
 * Generate CSP nonce for inline scripts
 * @returns {string} Random nonce
 */
export const generateCSPNonce = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < 16; i++) {
      nonce += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for Node.js
    for (let i = 0; i < 16; i++) {
      nonce += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return nonce;
};

/**
 * Meta tags for security (to be added to HTML head)
 */
export const getSecurityMetaTags = () => {
  return [
    { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
    { httpEquiv: 'Content-Security-Policy', content: getCSPHeader() },
    { name: 'referrer', content: 'strict-origin-when-cross-origin' }
  ];
};

export default {
  getCSPHeader,
  getSecurityHeaders,
  applySecurityHeaders,
  generateCSPNonce,
  getSecurityMetaTags
};