import express, { Request, Response, NextFunction } from "express";
import { Agent } from "./types/agent";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3040;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-token"],
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());

let agents: Agent[] = [];

// API token authentication middleware
const API_TOKEN = "your-secret-api-token";

function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers["x-api-token"];
  if (token !== API_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// Validation middleware for agent creation
function validateCreateAgent(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.body || typeof req.body !== "object") {
    console.error("Invalid request body:", req.body);
    res.status(400).json({ error: "Missing request body" });
    return;
  }
  const { firstName, lastName, email } = req.body;
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    (email !== undefined && email !== null && typeof email !== "string")
  ) {
    console.error("Invalid request body:", req.body);
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  next();
}

// Validation middleware for agent update
function validateUpdateAgent(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.body || typeof req.body !== "object") {
    console.error("Invalid request body:", req.body);
    res.status(400).json({ error: "Missing request body" });
    return;
  }

  const { firstName, lastName, email } = req.body;
  if (
    (firstName !== undefined && typeof firstName !== "string") ||
    (lastName !== undefined && typeof lastName !== "string") ||
    (email !== undefined && email !== null && typeof email !== "string")
  ) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  next();
}

// Create agent
app.post("/agents", authenticateToken, validateCreateAgent, (req, res) => {
  const { firstName, lastName, email } = req.body;

  const now = new Date().toISOString();
  const agent: Agent = {
    id: randomUUID(),
    firstName,
    lastName,
    email: email || null,
    avatarUrl: faker.image.avatar(),
    createdAt: now,
    updatedAt: now,
  };

  agents.push(agent);
  res.status(201).json(agent);
});

// Update agent
app.patch("/agents/:id", authenticateToken, validateUpdateAgent, (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  const agent = agents.find((u) => u.id === id);
  if (!agent) {
    res.status(404).json({ error: "Agent not found" });
  } else {
    agent.firstName = firstName ?? agent.firstName;
    agent.lastName = lastName ?? agent.lastName;
    agent.email = email ?? agent.email;
    agent.updatedAt = new Date().toISOString();

    res.json(agent);
  }
});

// Delete agent
app.delete("/agents/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const index = agents.findIndex((u) => u.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Agent not found" });
  } else {
    agents.splice(index, 1);
    res.status(204).send();
  }
});

// List agents with pagination
app.get("/agents", authenticateToken, (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedAgents = agents.slice(start, end);

  res.json({
    data: paginatedAgents,
    total: agents.length,
    page,
    pageSize: limit,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
