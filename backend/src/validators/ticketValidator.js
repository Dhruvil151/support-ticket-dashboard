import Joi from 'joi';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../domain/entities/Ticket.js';

export const createTicketSchema = Joi.object({
  title: Joi.string().min(3).max(120).required().messages({
    'string.base': 'Title must be a text string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'any.required': 'Title is a required field'
  }),
  description: Joi.string().min(5).max(1000).required().messages({
    'string.base': 'Description must be a text string',
    'string.empty': 'Description cannot be empty',
    'string.min': 'Description must be at least 5 characters long',
    'any.required': 'Description is a required field'
  }),
  priority: Joi.string().valid(...TICKET_PRIORITIES).optional().messages({
    'any.only': `Priority must be one of: ${TICKET_PRIORITIES.join(', ')}`
  })
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...TICKET_STATUSES).required().messages({
    'any.only': `Status must be one of: ${TICKET_STATUSES.join(', ')}`,
    'any.required': 'Status is required'
  })
});

export const getTicketsQuerySchema = Joi.object({
  status: Joi.string().valid(...TICKET_STATUSES).optional().messages({
    'any.only': `Status filter must be one of: ${TICKET_STATUSES.join(', ')}`
  })
});

export function validateRequest(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessages
      });
    }
    req[property] = value;
    next();
  };
}
