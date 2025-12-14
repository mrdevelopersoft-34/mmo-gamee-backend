const serverless = require("serverless-http");
const { app, initializeDB } = require("../../src/server");

// Initialize DB on cold start
let handler;

const getHandler = async () => {
  if (!handler) {
    await initializeDB();
    handler = serverless(app);
  }
  return handler;
};

exports.handler = async (event, context) => {
  // Ensure DB is connected
  await initializeDB();
  
  // Get or create handler
  const serverlessHandler = await getHandler();
  
  // Process the request
  return serverlessHandler(event, context);
};

