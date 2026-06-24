import dotenv from 'dotenv';
import { createServer } from './server.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 FuncSpan Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Proxy endpoint: http://localhost:${PORT}/proxy/:id`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
