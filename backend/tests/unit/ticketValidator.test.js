import {
  createTicketSchema,
  updateStatusSchema,
  getTicketsQuerySchema
} from '../../src/validators/ticketValidator.js';

describe('ticketValidator - Joi Schemas', () => {
  describe('createTicketSchema', () => {
    it('should validate successfully for a valid ticket creation payload', () => {
      const validPayload = {
        title: 'Fix Checkout Bug',
        description: 'Payment failed when user clicks checkout button',
        priority: 'high'
      };
      const { error, value } = createTicketSchema.validate(validPayload);
      expect(error).toBeUndefined();
      expect(value).toEqual(validPayload);
    });

    it('should allow ticket creation payload without priority (optional field)', () => {
      const validPayload = {
        title: 'Fix Checkout Bug',
        description: 'Payment failed when user clicks checkout button'
      };
      const { error } = createTicketSchema.validate(validPayload);
      expect(error).toBeUndefined();
    });

    it('should fail validation when title is missing or shorter than 3 characters', () => {
      const invalidPayloadShort = { title: 'AB', description: 'Valid description here' };
      const { error: errorShort } = createTicketSchema.validate(invalidPayloadShort);
      expect(errorShort).toBeDefined();

      const invalidPayloadMissing = { description: 'Valid description here' };
      const { error: errorMissing } = createTicketSchema.validate(invalidPayloadMissing);
      expect(errorMissing).toBeDefined();
    });

    it('should fail validation when description is missing or shorter than 5 characters', () => {
      const invalidPayload = { title: 'Valid Title', description: 'Tiny' };
      const { error } = createTicketSchema.validate(invalidPayload);
      expect(error).toBeDefined();
    });

    it('should fail validation for invalid priority strings', () => {
      const invalidPayload = {
        title: 'Valid Title',
        description: 'Valid Description',
        priority: 'critical' // Only 'low', 'medium', 'high' allowed
      };
      const { error } = createTicketSchema.validate(invalidPayload);
      expect(error).toBeDefined();
    });
  });

  describe('updateStatusSchema', () => {
    it('should pass for valid status values ("open", "in-progress", "resolved")', () => {
      ['open', 'in-progress', 'resolved'].forEach(status => {
        const { error } = updateStatusSchema.validate({ status });
        expect(error).toBeUndefined();
      });
    });

    it('should fail for invalid status values', () => {
      const { error } = updateStatusSchema.validate({ status: 'completed' });
      expect(error).toBeDefined();
    });

    it('should fail when status is missing', () => {
      const { error } = updateStatusSchema.validate({});
      expect(error).toBeDefined();
    });
  });

  describe('getTicketsQuerySchema', () => {
    it('should pass with valid status query param or empty object', () => {
      expect(getTicketsQuerySchema.validate({ status: 'open' }).error).toBeUndefined();
      expect(getTicketsQuerySchema.validate({}).error).toBeUndefined();
    });

    it('should fail with invalid status query param', () => {
      const { error } = getTicketsQuerySchema.validate({ status: 'unknown' });
      expect(error).toBeDefined();
    });
  });
});
