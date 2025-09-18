/**
 * Suspicious Pattern Monitoring Service
 * Detects and tracks suspicious patterns in form submissions
 */

import { securityLogger } from './securityLogger';

class PatternMonitor {
  constructor() {
    // Tracking maps
    this.submissionHistory = new Map(); // Track submissions per identifier
    this.ipHistory = new Map(); // Track IPs
    this.patternScores = new Map(); // Track pattern scores
    
    // Configuration
    this.config = {
      // Time windows (in milliseconds)
      shortWindow: 60000, // 1 minute
      mediumWindow: 300000, // 5 minutes
      longWindow: 3600000, // 1 hour
      
      // Thresholds
      maxSubmissionsPerMinute: 3,
      maxSubmissionsPerHour: 20,
      maxFailedAttempts: 5,
      minTimeBetweenSubmissions: 5000, // 5 seconds
      
      // Suspicious patterns
      suspiciousPatterns: [
        /(<script|javascript:|onerror=|onload=|alert\(|eval\()/gi,
        /(union|select|insert|update|delete|drop|create|alter|exec|execute|declare|xp_)/gi,
        /(\.\.\/|\.\.\\|%2e%2e|%252e)/gi, // Path traversal
        /(\x00|\x1a)/g, // Null bytes
        /(base64|fromcharcode|unescape|decode)/gi
      ],
      
      // Suspicious file patterns
      suspiciousFilePatterns: [
        /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|zip|rar)$/i,
        /^\./, // Hidden files
        /\.(php|asp|aspx|jsp)$/i // Server-side scripts
      ]
    };
    
    // Clean up old entries periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60000); // Every minute
    }
  }

  /**
   * Check submission for suspicious patterns
   * @param {string} identifier - Email or IP
   * @param {object} formData - Form data to check
   * @returns {object} Analysis result
   */
  async analyzeSubmission(identifier, formData) {
    const analysis = {
      suspicious: false,
      score: 0,
      reasons: [],
      blocked: false
    };

    // Check submission rate
    const rateCheck = this.checkSubmissionRate(identifier);
    if (rateCheck.suspicious) {
      analysis.suspicious = true;
      analysis.score += rateCheck.score;
      analysis.reasons.push(rateCheck.reason);
      
      if (rateCheck.block) {
        analysis.blocked = true;
      }
    }

    // Check for suspicious patterns in data
    const patternCheck = this.checkSuspiciousPatterns(formData);
    if (patternCheck.suspicious) {
      analysis.suspicious = true;
      analysis.score += patternCheck.score;
      analysis.reasons = [...analysis.reasons, ...patternCheck.reasons];
    }

    // Check for automated behavior
    const botCheck = this.checkBotBehavior(identifier, formData);
    if (botCheck.suspicious) {
      analysis.suspicious = true;
      analysis.score += botCheck.score;
      analysis.reasons.push(botCheck.reason);
    }

    // Check file uploads if present
    if (formData.fileAttachments?.length > 0) {
      const fileCheck = this.checkFileUploads(formData.fileAttachments);
      if (fileCheck.suspicious) {
        analysis.suspicious = true;
        analysis.score += fileCheck.score;
        analysis.reasons = [...analysis.reasons, ...fileCheck.reasons];
      }
    }

    // Log if suspicious
    if (analysis.suspicious) {
      await securityLogger.logSuspiciousPattern('multiple_patterns', {
        identifier: securityLogger.hashIdentifier(identifier),
        score: analysis.score,
        reasons: analysis.reasons
      });
    }

    // Update history
    this.updateHistory(identifier, analysis);

    return analysis;
  }

  /**
   * Check submission rate
   */
  checkSubmissionRate(identifier) {
    const now = Date.now();
    const history = this.submissionHistory.get(identifier) || [];
    
    // Clean old entries
    const recentHistory = history.filter(time => now - time < this.config.longWindow);
    
    // Check short window (1 minute)
    const shortWindowCount = recentHistory.filter(
      time => now - time < this.config.shortWindow
    ).length;
    
    if (shortWindowCount >= this.config.maxSubmissionsPerMinute) {
      return {
        suspicious: true,
        score: 30,
        reason: 'Too many submissions in short time',
        block: true
      };
    }
    
    // Check long window (1 hour)
    const longWindowCount = recentHistory.length;
    if (longWindowCount >= this.config.maxSubmissionsPerHour) {
      return {
        suspicious: true,
        score: 20,
        reason: 'Excessive submissions in past hour',
        block: false
      };
    }
    
    // Check time between submissions
    if (recentHistory.length > 0) {
      const lastSubmission = recentHistory[recentHistory.length - 1];
      const timeDiff = now - lastSubmission;
      
      if (timeDiff < this.config.minTimeBetweenSubmissions) {
        return {
          suspicious: true,
          score: 15,
          reason: 'Submissions too rapid',
          block: false
        };
      }
    }
    
    return { suspicious: false };
  }

  /**
   * Check for suspicious patterns in form data
   */
  checkSuspiciousPatterns(formData) {
    const result = {
      suspicious: false,
      score: 0,
      reasons: []
    };

    // Convert form data to string for pattern matching
    const dataString = JSON.stringify(formData).toLowerCase();
    
    // Check each suspicious pattern
    for (const pattern of this.config.suspiciousPatterns) {
      if (pattern.test(dataString)) {
        result.suspicious = true;
        result.score += 25;
        result.reasons.push(`Suspicious pattern detected: ${pattern.source}`);
        
        // Log specific pattern
        securityLogger.logSuspiciousPattern('pattern_match', {
          pattern: pattern.source,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Check for unusual field lengths
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        if (value.length > 10000) {
          result.suspicious = true;
          result.score += 10;
          result.reasons.push(`Excessive field length: ${key}`);
        }
        
        // Check for repeated characters (possible spam)
        const repeatedChars = /(.)\1{10,}/;
        if (repeatedChars.test(value)) {
          result.suspicious = true;
          result.score += 5;
          result.reasons.push(`Repeated characters in ${key}`);
        }
      }
    }
    
    return result;
  }

  /**
   * Check for bot-like behavior
   */
  checkBotBehavior(identifier, formData) {
    const result = {
      suspicious: false,
      score: 0,
      reason: null
    };

    // Check if all fields are filled (bots often fill hidden/optional fields)
    const filledFields = Object.values(formData).filter(v => v && v !== '').length;
    const totalFields = Object.keys(formData).length;
    
    if (filledFields === totalFields && totalFields > 10) {
      result.suspicious = true;
      result.score += 10;
      result.reason = 'All fields filled (bot-like behavior)';
    }
    
    // Check for honeypot fields (if implemented)
    if (formData.honeypot && formData.honeypot !== '') {
      result.suspicious = true;
      result.score += 50;
      result.reason = 'Honeypot field filled';
    }
    
    // Check submission timing patterns
    const history = this.submissionHistory.get(identifier) || [];
    if (history.length >= 3) {
      const intervals = [];
      for (let i = 1; i < history.length; i++) {
        intervals.push(history[i] - history[i - 1]);
      }
      
      // Check if intervals are too consistent (automated)
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, interval) => {
        return sum + Math.pow(interval - avgInterval, 2);
      }, 0) / intervals.length;
      
      // Low variance suggests automated submissions
      if (variance < 1000 && intervals.length >= 3) {
        result.suspicious = true;
        result.score += 15;
        result.reason = 'Consistent submission intervals (automated)';
      }
    }
    
    return result;
  }

  /**
   * Check file uploads for suspicious patterns
   */
  checkFileUploads(files) {
    const result = {
      suspicious: false,
      score: 0,
      reasons: []
    };

    for (const file of files) {
      // Check suspicious file extensions
      for (const pattern of this.config.suspiciousFilePatterns) {
        if (pattern.test(file.filename || file.name)) {
          result.suspicious = true;
          result.score += 20;
          result.reasons.push(`Suspicious file: ${file.filename || file.name}`);
        }
      }
      
      // Check for oversized files
      if (file.size > 500 * 1024 * 1024) { // 500MB
        result.suspicious = true;
        result.score += 10;
        result.reasons.push('Very large file upload');
      }
      
      // Check for many files
      if (files.length > 20) {
        result.suspicious = true;
        result.score += 5;
        result.reasons.push('Excessive number of files');
      }
    }
    
    return result;
  }

  /**
   * Update submission history
   */
  updateHistory(identifier, analysis) {
    const now = Date.now();
    
    // Update submission history
    const history = this.submissionHistory.get(identifier) || [];
    history.push(now);
    this.submissionHistory.set(identifier, history);
    
    // Update pattern scores
    const scores = this.patternScores.get(identifier) || [];
    scores.push({
      time: now,
      score: analysis.score,
      suspicious: analysis.suspicious
    });
    this.patternScores.set(identifier, scores);
  }

  /**
   * Get risk score for identifier
   */
  getRiskScore(identifier) {
    const scores = this.patternScores.get(identifier) || [];
    if (scores.length === 0) return 0;
    
    // Calculate weighted average (recent scores weighted more)
    const now = Date.now();
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const entry of scores) {
      const age = now - entry.time;
      const weight = Math.max(0, 1 - (age / this.config.longWindow));
      totalScore += entry.score * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Check if identifier should be blocked
   */
  shouldBlock(identifier) {
    const riskScore = this.getRiskScore(identifier);
    const history = this.submissionHistory.get(identifier) || [];
    const recentHistory = history.filter(
      time => Date.now() - time < this.config.mediumWindow
    );
    
    // Block if high risk score
    if (riskScore > 50) return true;
    
    // Block if too many recent attempts
    if (recentHistory.length > this.config.maxFailedAttempts) return true;
    
    return false;
  }

  /**
   * Clean up old entries
   */
  cleanup() {
    const now = Date.now();
    const cutoff = now - this.config.longWindow;
    
    // Clean submission history
    for (const [identifier, history] of this.submissionHistory.entries()) {
      const cleaned = history.filter(time => time > cutoff);
      if (cleaned.length === 0) {
        this.submissionHistory.delete(identifier);
      } else {
        this.submissionHistory.set(identifier, cleaned);
      }
    }
    
    // Clean pattern scores
    for (const [identifier, scores] of this.patternScores.entries()) {
      const cleaned = scores.filter(entry => entry.time > cutoff);
      if (cleaned.length === 0) {
        this.patternScores.delete(identifier);
      } else {
        this.patternScores.set(identifier, cleaned);
      }
    }
  }

  /**
   * Get monitoring statistics
   */
  getStats() {
    const stats = {
      tracked_identifiers: this.submissionHistory.size,
      suspicious_identifiers: 0,
      high_risk_identifiers: 0,
      total_submissions: 0
    };

    for (const [identifier, history] of this.submissionHistory.entries()) {
      stats.total_submissions += history.length;
      
      const riskScore = this.getRiskScore(identifier);
      if (riskScore > 20) stats.suspicious_identifiers++;
      if (riskScore > 50) stats.high_risk_identifiers++;
    }

    return stats;
  }
}

// Export singleton instance
export const patternMonitor = new PatternMonitor();

export default PatternMonitor;