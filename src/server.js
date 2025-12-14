require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const connectDB = require("./config/db");
const initPassport = require("./config/passport");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const swaggerUi = require("swagger-ui-express");
const { getSpec } = require("./swagger");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
initPassport();

// Root route
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "MMO Backend API is running",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile",
      docs: "/api-docs"
    }
  });
});

app.use("/api/auth", authRoutes);
app.get("/api/profile", auth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role, provider: req.user.provider, citizenName: req.user.citizenName, citizenship: req.user.citizenship });
});

const spec = getSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// Initialize database connection (for serverless, this will be called per request)
let dbConnected = false;
const initializeDB = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// For local development
const start = async () => {
  await initializeDB();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Export app for serverless (Netlify Functions)
module.exports = { app, initializeDB };

// Start server only if running locally (not in serverless environment)
if (require.main === module) {
  start();
}
