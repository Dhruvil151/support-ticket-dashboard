import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { InMemoryTicketRepository } from './repositories/InMemoryTicketRepository.js';
import { TicketService } from './services/TicketService.js';
import { TicketController } from './controllers/TicketController.js';
import {
  createTicketSchema,
  updateStatusSchema,
  getTicketsQuerySchema,
  validateRequest
} from './validators/ticketValidator.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Global Middleware
  app.use(cors());
  app.use(express.json());

  // Swagger Documentation Route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'ticket-dashboard-backend',
      timestamp: new Date().toISOString()
    });
  });

  // Clean Architecture Dependency Injection Setup
  const ticketRepository = new InMemoryTicketRepository();
  const ticketService = new TicketService(ticketRepository);
  const ticketController = new TicketController(ticketService);

  // API Routes
  const router = express.Router();

  router.get(
    '/tickets',
    validateRequest(getTicketsQuerySchema, 'query'),
    ticketController.getTickets
  );

  router.post(
    '/tickets',
    validateRequest(createTicketSchema, 'body'),
    ticketController.createTicket
  );

  router.patch(
    '/tickets/:id/status',
    validateRequest(updateStatusSchema, 'body'),
    ticketController.updateStatus
  );

  app.use('/api', router);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
