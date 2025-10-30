import { body, validationResult } from 'express-validator';

// Validation rules for URL generation
const validateUrlGeneration = [
  body('url')
    .trim()
    .isLength({ min: 1 })
    .withMessage('URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Must be a valid URL with http or https protocol'),
  
  body('shortId')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Custom short ID must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Custom short ID can only contain letters, numbers, hyphens, and underscores'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO 8601 date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        throw new Error('Expiration date must be in the future');
      }
      // Limit to 1 year in the future
      const oneYearFromNow = new Date(now.setFullYear(now.getFullYear() + 1));
      if (date > oneYearFromNow) {
        throw new Error('Expiration date cannot be more than 1 year in the future');
      }
      return true;
    }),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

export { validateUrlGeneration };