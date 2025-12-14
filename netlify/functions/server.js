const serverless = require("serverless-http");
const { app, initializeDB } = require("../../src/server");

// Initialize DB on cold start
let handler;

const getHandler = async () => {
  if (!handler) {
    try {
      await initializeDB();
      handler = serverless(app, {
        binary: ['image/*', 'application/pdf']
      });
    } catch (error) {
      console.error("Error initializing handler:", error);
      throw error;
    }
  }
  return handler;
};

exports.handler = async (event, context) => {
  // Enable Lambda to keep the connection alive
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Ensure DB is connected
    await initializeDB();
    
    // Get or create handler
    const serverlessHandler = await getHandler();
    
    // Process the request
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Internal Server Error",
        message: error.message 
      })
    };
  }
};

