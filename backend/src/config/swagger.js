import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Support Ticket Dashboard API',
      version: '1.0.0',
      description: 'Clean Architecture REST API for Support Ticket Dashboard with AI-assisted Priority Suggestion engine.'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    components: {
      schemas: {
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 't-101' },
            title: { type: 'string', example: 'Payment Gateway Timeout' },
            description: { type: 'string', example: 'Users reporting payment failed error during checkout.' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
            status: { type: 'string', enum: ['open', 'in-progress', 'resolved'], example: 'open' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-08-12T14:00:00.000Z' }
          }
        },
        CreateTicketInput: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', example: 'Payment Gateway Timeout', minLength: 3 },
            description: { type: 'string', example: 'Users reporting payment failed error during checkout.', minLength: 5 },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Optional. Auto-suggested via AI keyword engine if omitted.' }
          }
        },
        UpdateStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['open', 'in-progress', 'resolved'], example: 'in-progress' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation Error' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    paths: {
      '/api/tickets': {
        get: {
          summary: 'Retrieve all tickets',
          parameters: [
            {
              in: 'query',
              name: 'status',
              schema: { type: 'string', enum: ['open', 'in-progress', 'resolved'] },
              description: 'Filter tickets by status'
            }
          ],
          responses: {
            200: {
              description: 'List of tickets',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'number', example: 4 },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new ticket',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateTicketInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Ticket successfully created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Ticket created successfully' },
                      data: { $ref: '#/components/schemas/Ticket' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Validation Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/tickets/{id}/status': {
        patch: {
          summary: "Update a ticket's status",
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Ticket ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateStatusInput' }
              }
            }
          },
          responses: {
            200: {
              description: 'Ticket status updated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Ticket status updated successfully' },
                      data: { $ref: '#/components/schemas/Ticket' }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Ticket Not Found'
            }
          }
        }
      }
    }
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(options);
