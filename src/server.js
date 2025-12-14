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

// Health check endpoint for Railway
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "MMO Backend API is running" });
});

app.use("/api/auth", authRoutes);
app.get("/api/profile", auth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role, provider: req.user.provider, citizenName: req.user.citizenName, citizenship: req.user.citizenship });
});

const spec = getSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

const start = async () => {
  await connectDB();
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  app.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
  });
};

start();
