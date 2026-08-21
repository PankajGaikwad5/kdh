/**
 * Spam detection utilities for contact forms
 */

/**
 * Check if text contains too many random characters or gibberish
 * @param {string} text - The text to check
 * @returns {boolean} - True if text appears to be spam
 */
export function isGibberish(text) {
  if (!text || text.length < 3) return false;

  // Check for excessive consecutive consonants (common in spam)
  const consecutiveConsonants = /[bcdfghjklmnpqrstvwxyz]{6,}/i;
  if (consecutiveConsonants.test(text)) return true;

  // Check for random uppercase/lowercase pattern (e.g., "aPvNpGeZqWr")
  const randomCasePattern = /[a-z][A-Z][a-z][A-Z][a-z][A-Z]/;
  if (randomCasePattern.test(text)) return true;

  // Check vowel to consonant ratio (gibberish usually has very low vowel ratio)
  const vowels = text.match(/[aeiou]/gi) || [];
  const consonants = text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
  const vowelRatio = vowels.length / (vowels.length + consonants.length);

  // If less than 15% vowels, likely gibberish
  if (consonants.length > 5 && vowelRatio < 0.15) return true;

  // Check for excessive special characters
  const specialChars = text.match(/[^a-zA-Z0-9\s.,!?'-]/g) || [];
  if (specialChars.length / text.length > 0.3) return true;

  return false;
}

/**
 * Validate that name looks legitimate
 * @param {string} name - The name to validate
 * @returns {object} - { valid: boolean, reason: string }
 */
export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { valid: false, reason: 'Name is too short' };
  }

  if (isGibberish(name)) {
    return { valid: false, reason: 'Name appears to be invalid' };
  }

  // Check if name has at least one vowel
  if (!/[aeiou]/i.test(name)) {
    return { valid: false, reason: 'Name appears to be invalid' };
  }

  return { valid: true };
}

/**
 * Validate that message looks legitimate
 * @param {string} message - The message to validate
 * @returns {object} - { valid: boolean, reason: string }
 */
export function validateMessage(message) {
  if (!message || message.trim().length < 2) {
    return { valid: false, reason: 'Message is too short' };
  }

  if (isGibberish(message)) {
    return { valid: false, reason: 'Message appears to be spam' };
  }

  // Check for at least some spaces (real messages have words)
  const words = message.trim().split(/\s+/);
  if (words.length < 2 && message.length > 30) {
    return { valid: false, reason: 'Message appears to be invalid' };
  }

  return { valid: true };
}

/**
 * Validate email format and check for suspicious patterns
 * @param {string} email - The email to validate
 * @returns {object} - { valid: boolean, reason: string }
 */
export function validateEmail(email) {
  if (!email) {
    return { valid: false, reason: 'Email is required' };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  // Check if local part (before @) is gibberish
  const localPart = email.split('@')[0];
  if (isGibberish(localPart)) {
    return { valid: false, reason: 'Email appears to be invalid' };
  }

  return { valid: true };
}

/**
 * Rate limiting check using simple in-memory store
 * In production, use Redis or database
 */
const submissionTracker = new Map();
let lastCleanup = Date.now();

export function checkRateLimit(
  identifier,
  maxAttempts = 3,
  windowMs = 3600000,
) {
  const now = Date.now();
  
  // Lazily clean up old rate limit entries every 10 minutes without unmanaged top-level timers
  if (now - lastCleanup > 600000) {
    cleanupRateLimiter();
    lastCleanup = now;
  }

  const key = identifier;

  if (!submissionTracker.has(key)) {
    submissionTracker.set(key, []);
  }

  const attempts = submissionTracker.get(key);

  // Remove old attempts outside the time window
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return {
      allowed: false,
      reason: 'Too many submissions. Please try again later.',
    };
  }

  // Add current attempt
  recentAttempts.push(now);
  submissionTracker.set(key, recentAttempts);

  return { allowed: true };
}

/**
 * Clean up old entries from rate limiter
 */
export function cleanupRateLimiter() {
  const now = Date.now();
  const oneHour = 3600000;

  for (const [key, attempts] of submissionTracker.entries()) {
    const recentAttempts = attempts.filter((time) => now - time < oneHour);
    if (recentAttempts.length === 0) {
      submissionTracker.delete(key);
    } else {
      submissionTracker.set(key, recentAttempts);
    }
  }
}
