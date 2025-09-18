/**
 * Security Event Logging Service
 * Logs security events to Supabase for monitoring and analysis
 */

import { supabase } from '../lib/supabase';

class SecurityLogger {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.batchSize = 10;
    this.flushInterval = 5000; // 5 seconds
    
    // Start the flush interval
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  /**
   * Log a security event
   * @param {string} eventType - Type of security event
   * @param {object} eventData - Event details
   * @param {boolean} suspicious - Mark as suspicious activity
   */
  async log(eventType, eventData, suspicious = false) {
    const event = {
      timestamp: new Date().toISOString(),
      event_type: eventType,
      event_data: eventData,
      suspicious,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      ip: null // Will be set server-side
    };

    // Add to queue
    this.queue.push(event);

    // Flush if queue is full
    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Security Event] ${eventType}:`, eventData);
    }
  }

  /**
   * Flush the event queue to database
   */
  async flush() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const events = [...this.queue];
    this.queue = [];

    try {
      const { error } = await supabase
        .from('security_logs')
        .insert(events);

      if (error) {
        console.error('Failed to log security events:', error);
        // Re-add events to queue on failure
        this.queue.unshift(...events);
      }
    } catch (err) {
      console.error('Security logging error:', err);
      // Re-add events to queue on failure
      this.queue.unshift(...events);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Log form submission attempt
   */
  async logFormSubmission(formType, data, success = true) {
    const sanitizedData = this.sanitizeForLogging(data);
    
    await this.log('form_submission', {
      form_type: formType,
      success,
      has_files: data.fileAttachments?.length > 0,
      file_count: data.fileAttachments?.length || 0,
      company: sanitizedData.company || sanitizedData.company_name,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log validation failure
   */
  async logValidationFailure(formType, errors, data) {
    const sanitizedData = this.sanitizeForLogging(data);
    
    await this.log('validation_failure', {
      form_type: formType,
      errors: Object.keys(errors),
      error_count: Object.keys(errors).length,
      data_sample: sanitizedData
    }, true); // Mark as suspicious
  }

  /**
   * Log rate limit hit
   */
  async logRateLimitHit(identifier, endpoint) {
    await this.log('rate_limit_hit', {
      identifier: this.hashIdentifier(identifier),
      endpoint,
      timestamp: new Date().toISOString()
    }, true); // Mark as suspicious
  }

  /**
   * Log suspicious pattern detected
   */
  async logSuspiciousPattern(patternType, details) {
    await this.log('suspicious_pattern', {
      pattern_type: patternType,
      details,
      timestamp: new Date().toISOString()
    }, true);
  }

  /**
   * Log file upload attempt
   */
  async logFileUpload(fileName, fileSize, success = true, error = null) {
    await this.log('file_upload', {
      file_name: this.sanitizeFileName(fileName),
      file_size: fileSize,
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log reCAPTCHA verification
   */
  async logReCaptchaVerification(score, success) {
    await this.log('recaptcha_verification', {
      score,
      success,
      timestamp: new Date().toISOString()
    }, score < 0.3); // Mark as suspicious if score is very low
  }

  /**
   * Log SQL injection attempt
   */
  async logSQLInjectionAttempt(field, value) {
    await this.log('sql_injection_attempt', {
      field,
      value_length: value.length,
      timestamp: new Date().toISOString()
    }, true);
  }

  /**
   * Log XSS attempt
   */
  async logXSSAttempt(field, value) {
    await this.log('xss_attempt', {
      field,
      value_length: value.length,
      timestamp: new Date().toISOString()
    }, true);
  }

  /**
   * Sanitize data for logging (remove sensitive info)
   */
  sanitizeForLogging(data) {
    if (!data) return null;
    
    const sanitized = { ...data };
    const sensitiveFields = [
      'email', 'phone', 'phone_number', 'company_phone', 
      'email_w9_coi', 'password', 'ssn', 'credit_card'
    ];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = this.maskValue(sanitized[field]);
      }
    }
    
    return sanitized;
  }

  /**
   * Mask sensitive value
   */
  maskValue(value) {
    if (!value || typeof value !== 'string') return value;
    
    if (value.includes('@')) {
      // Email masking
      const [user, domain] = value.split('@');
      return `${user[0]}***@${domain}`;
    } else if (value.match(/^\d+$/)) {
      // Phone number masking
      return `***${value.slice(-4)}`;
    } else {
      // General masking
      return value.length > 4 
        ? `${value[0]}***${value[value.length - 1]}`
        : '***';
    }
  }

  /**
   * Hash identifier for privacy
   */
  hashIdentifier(identifier) {
    if (!identifier) return null;
    
    // Simple hash for logging (not cryptographically secure)
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(36);
  }

  /**
   * Sanitize file name for logging
   */
  sanitizeFileName(fileName) {
    if (!fileName) return null;
    
    const extension = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    
    if (name.length > 20) {
      return `${name.substring(0, 10)}...${name.slice(-5)}.${extension}`;
    }
    
    return fileName;
  }

  /**
   * Get security metrics for monitoring
   */
  async getSecurityMetrics(timeRange = '24 hours') {
    try {
      // Get suspicious activity count
      const { data: suspiciousData, error: suspiciousError } = await supabase
        .from('security_logs')
        .select('count')
        .eq('suspicious', true)
        .gte('timestamp', new Date(Date.now() - this.parseTimeRange(timeRange)).toISOString());

      if (suspiciousError) throw suspiciousError;

      // Get total events count
      const { data: totalData, error: totalError } = await supabase
        .from('security_logs')
        .select('count')
        .gte('timestamp', new Date(Date.now() - this.parseTimeRange(timeRange)).toISOString());

      if (totalError) throw totalError;

      // Get events by type
      const { data: eventTypes, error: eventError } = await supabase
        .from('security_logs')
        .select('event_type')
        .gte('timestamp', new Date(Date.now() - this.parseTimeRange(timeRange)).toISOString());

      if (eventError) throw eventError;

      const eventTypeCounts = {};
      eventTypes.forEach(event => {
        eventTypeCounts[event.event_type] = (eventTypeCounts[event.event_type] || 0) + 1;
      });

      return {
        suspicious_count: suspiciousData?.[0]?.count || 0,
        total_count: totalData?.[0]?.count || 0,
        event_types: eventTypeCounts,
        time_range: timeRange
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return null;
    }
  }

  /**
   * Parse time range string to milliseconds
   */
  parseTimeRange(timeRange) {
    const units = {
      'hour': 60 * 60 * 1000,
      'hours': 60 * 60 * 1000,
      'day': 24 * 60 * 60 * 1000,
      'days': 24 * 60 * 60 * 1000,
      'week': 7 * 24 * 60 * 60 * 1000,
      'weeks': 7 * 24 * 60 * 60 * 1000
    };

    const match = timeRange.match(/(\d+)\s*(hour|hours|day|days|week|weeks)/i);
    if (match) {
      const [, num, unit] = match;
      return parseInt(num) * units[unit.toLowerCase()];
    }

    // Default to 24 hours
    return 24 * 60 * 60 * 1000;
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();

export default SecurityLogger;