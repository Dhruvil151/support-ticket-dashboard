import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Backend API Integration Tests (Supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /health', () => {
    it('should return 200 OK with health status info', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('UP');
    });
  });

  describe('GET /api-docs', () => {
    it('should serve Swagger UI documentation page', async () => {
      const response = await request(app).get('/api-docs/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('swagger');
    });
  });

  describe('GET /api/tickets', () => {
    it('should return 200 OK and list of tickets', async () => {
      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return 200 OK with status filter query parameter', async () => {
      const res = await request(app).get('/api/tickets?status=open');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.every(t => t.status === 'open')).toBe(true);
    });

    it('should return 400 Bad Request for invalid status filter parameter', async () => {
      const res = await request(app).get('/api/tickets?status=invalid_status');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket and return 201 Created', async () => {
      const payload = {
        title: 'Critical Security Vulnerability',
        description: 'Urgent security bug in authentication module'
      };

      const res = await request(app)
        .post('/api/tickets')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.priority).toBe('high'); // Auto suggested by AI engine
      expect(res.body.data.status).toBe('open');
    });

    it('should return 400 Bad Request with Joi details when payload is invalid', async () => {
      const invalidPayload = { title: 'Hi', description: 'Tiny' }; // Title < 3, Description < 5

      const res = await request(app)
        .post('/api/tickets')
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation Error');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe('PATCH /api/tickets/:id/status', () => {
    it('should update ticket status and return 200 OK', async () => {
      // First fetch a ticket
      const listRes = await request(app).get('/api/tickets');
      const ticket = listRes.body.data[0];

      const patchRes = await request(app)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'resolved' });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.success).toBe(true);
      expect(patchRes.body.data.status).toBe('resolved');
    });

    it('should return 400 Bad Request for invalid status string', async () => {
      const listRes = await request(app).get('/api/tickets');
      const ticket = listRes.body.data[0];

      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'finished' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 Not Found when updating non-existent ticket ID', async () => {
      const res = await request(app)
        .patch('/api/tickets/non-existent-id-9999/status')
        .send({ status: 'resolved' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });
});
