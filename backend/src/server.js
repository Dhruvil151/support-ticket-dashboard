import { createApp } from './app.js';

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
  console.log(`🚀 Support Ticket Backend API running on http://localhost:${PORT}`);
  console.log(`📚 Swagger OpenAPI documentation available at http://localhost:${PORT}/api-docs`);
});
