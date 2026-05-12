import { ENV } from './config/env.js';
import app from './app.js';

const startServer = async () => {
  try {
    app.listen(ENV.PORT, () => {
      console.log(
        `🚀 Server running in ${ENV.NODE_ENV} mode on http://localhost:${ENV.PORT}`
      );
    });
  } catch (error) {
    console.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
