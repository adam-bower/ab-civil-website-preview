/**
 * Security utilities for form validation and sanitization
 */

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // Convert to string if not already
  const str = String(input);
  
  // Remove script tags and dangerous HTML, but preserve spaces and normal text
  let sanitized = str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Escape dangerous characters but preserve spaces
  sanitized = sanitized.replace(/[<>]/g, (match) => {
    const escapeMap = {
      '<': '&lt;',
      '>': '&gt;'
    };
    return escapeMap[match];
  });
  
  // Preserve spaces but trim start and end
  return sanitized.trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (US)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  // Remove all formatting and +1 country code for validation
  let cleaned = phone.replace(/\D/g, '');
  // Remove leading 1 if present (from +1 country code)
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    cleaned = cleaned.substring(1);
  }
  // Should be exactly 10 digits after removing country code
  return cleaned.length === 10;
};

/**
 * Sanitize file path to prevent directory traversal
 * @param {string} filename - File name to sanitize
 * @returns {string} Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename) return '';
  
  // Remove path traversal attempts
  return filename
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '_')
    .replace(/^\.+/, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .substring(0, 255); // Limit filename length
};

/**
 * Generate cryptographically secure random ID
 * @param {number} length - Length of ID (default 16)
 * @returns {string} Random ID
 */
export const generateSecureId = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js environment
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  
  return result;
};

/**
 * Validate form data against injection attacks
 * @param {object} data - Form data to validate
 * @returns {object} Validation result
 */
export const validateFormData = (data) => {
  const errors = {};
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|WHERE|FROM|ORDER BY|GROUP BY|HAVING)\b|--|\/\*|\*\/|xp_|sp_|<script|javascript:|onerror=|onload=)/gi;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Check for SQL injection patterns
      if (sqlInjectionPattern.test(value)) {
        errors[key] = 'Invalid characters detected';
      }
      
      // Check for excessive length (potential DoS)
      if (value.length > 10000) {
        errors[key] = 'Input too long';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Rate limiting tracker (client-side)
 */
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  check(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Clean old attempts
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = recentAttempts[0];
      const timeToWait = Math.ceil((this.windowMs - (now - oldestAttempt)) / 1000);
      return {
        allowed: false,
        timeToWait,
        message: `Too many attempts. Please wait ${timeToWait} seconds.`
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return { allowed: true };
  }
  
  reset(key) {
    this.attempts.delete(key);
  }
}

// Export a singleton rate limiter instance
export const formSubmissionLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

/**
 * Mask sensitive data for logging
 * @param {any} data - Data to mask
 * @returns {any} Masked data
 */
export const maskSensitiveData = (data) => {
  if (!data) return data;
  
  const sensitiveFields = ['email', 'phone', 'phone_number', 'company_phone', 'email_w9_coi', 'ssn', 'password'];
  
  const mask = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const masked = Array.isArray(obj) ? [...obj] : { ...obj };
    
    for (const [key, value] of Object.entries(masked)) {
      const lowerKey = key.toLowerCase();
      
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        if (typeof value === 'string' && value.length > 0) {
          // Keep first and last character, mask the rest
          masked[key] = value.length > 2
            ? value[0] + '*'.repeat(Math.min(value.length - 2, 10)) + value[value.length - 1]
            : '*'.repeat(value.length);
        }
      } else if (typeof value === 'object' && value !== null) {
        masked[key] = mask(value);
      }
    }
    
    return masked;
  };
  
  return mask(data);
};

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 2 * 1024 * 1024 * 1024, // 2GB default
    allowedTypes = [],
    allowedExtensions = []
  } = options;
  
  const errors = [];
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push('File extension not allowed');
    }
  }
  
  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.com$/i,
    /\.pif$/i,
    /\.scr$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i
  ];
  
  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('Potentially dangerous file type detected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if running in iframe and validate parent origin
 * @param {string[]} allowedOrigins - List of allowed parent origins
 * @returns {boolean} True if allowed
 */
export const validateIframeOrigin = (allowedOrigins = []) => {
  if (typeof window === 'undefined') return true;
  
  // Check if in iframe
  const inIframe = window.self !== window.top;
  
  if (!inIframe) return true;
  
  // If in iframe, validate parent origin
  try {
    const parentOrigin = document.referrer ? new URL(document.referrer).origin : '';
    
    if (allowedOrigins.length === 0) {
      // If no origins specified, allow all
      return true;
    }
    
    return allowedOrigins.includes(parentOrigin);
  } catch (e) {
    console.error('Error validating iframe origin:', e);
    return false;
  }
};

export default {
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  sanitizeFilename,
  generateSecureId,
  validateFormData,
  formSubmissionLimiter,
  maskSensitiveData,
  validateFile,
  validateIframeOrigin
};