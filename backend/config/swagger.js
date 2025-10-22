import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Management API',
      version: '1.0.0',
      description: 'API documentation for Project Management System with workspaces, projects, tasks, and members',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Workspace: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'My Workspace' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Website Redesign' },
            workspaceId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Design homepage' },
            status: { type: 'string', enum: ['Backlog', 'Todo', 'Doing', 'Done'], example: 'Todo' },
            workspaceId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            assignedId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            dueDate: { type: 'string', format: 'date', example: '2025-12-31' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Member: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { 
              type: 'object',
              properties: {
                _id: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' }
              }
            },
            workspaceId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            role: { type: 'string', enum: ['admin', 'member'], example: 'member' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'] // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
