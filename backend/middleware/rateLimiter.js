import rateLimit from 'express-rate-limit';

// General API rate limiter - loose limits for normal usage
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter - stricter for login/register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: { message: 'Too many authentication attempts, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Password reset limiter - very strict to prevent email bombing
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: { message: 'Too many password reset requests, please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form limiter - prevent spam
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 messages per hour
  message: { message: 'Too many messages sent, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration limiter - prevent mass account creation
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  message: { message: 'Too many accounts created, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
