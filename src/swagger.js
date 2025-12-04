const swaggerJsdoc = require("swagger-jsdoc");

const getSpec = () => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "eRepublic Auth API",
        version: "1.0.0"
      },
      servers: [{ url: process.env.SWAGGER_SERVER_URL || "http://localhost:" + (process.env.PORT || 3000) }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
        },
        schemas: {
          SignupInput: {
            type: "object",
            properties: { email: { type: "string" }, password: { type: "string" }, citizenName: { type: "string" }, citizenship: { type: "string" } },
            required: ["email", "password", "citizenName", "citizenship"]
          },
          SigninInput: {
            type: "object",
            properties: { email: { type: "string" }, password: { type: "string" } },
            required: ["email", "password"]
          },
          AuthUser: {
            type: "object",
            properties: { id: { type: "string" }, email: { type: "string" }, role: { type: "string" }, provider: { type: "string" }, citizenName: { type: "string" }, citizenship: { type: "string" } }
          },
          AuthResponse: {
            type: "object",
            properties: { token: { type: "string" }, user: { $ref: "#/components/schemas/AuthUser" } }
          }
        }
      },
      paths: {
        "/api/auth/signup": {
          post: {
            summary: "Signup with email and password",
            requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SignupInput" } } } },
            responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } }, "409": { description: "Conflict" } }
          }
        },
        "/api/auth/signin": {
          post: {
            summary: "Signin with email and password",
            requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SigninInput" } } } },
            responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } }, "401": { description: "Unauthorized" } }
          }
        },
        "/api/auth/facebook": {
          get: { summary: "Start Facebook OAuth", responses: { "302": { description: "Redirect" } } }
        },
        "/api/auth/facebook/callback": {
          get: { summary: "Facebook OAuth callback", responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } }, "401": { description: "Unauthorized" } } }
        },
        "/api/profile": {
          get: { summary: "Get profile", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } } }
        }
      }
    },
    apis: []
  };
  return swaggerJsdoc(options);
};

module.exports = { getSpec };
