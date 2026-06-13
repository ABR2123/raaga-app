// Vercel serverless entry point — wraps the Express app
const path = require("path");

// Dynamically load the compiled bundle
let app;
try {
  app = require("../artifacts/api-server/dist/index.cjs");
  if (app.default) app = app.default;
} catch (e) {
  // fallback: build inline express app
  const express = require("express");
  const cors = require("cors");
  app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/api/healthz", (_, res) => res.json({ ok: true }));
  app.use((_, res) => res.status(503).json({ error: "Build not available" }));
}

module.exports = app;
