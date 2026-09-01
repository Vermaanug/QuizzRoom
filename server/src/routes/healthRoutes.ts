import express, { Router } from "express";
import { prisma } from "../db/prisma.js";

const healthRouter: Router = express.Router();

healthRouter.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      db: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      db: "unreachable",
      timestamp: new Date().toISOString(),
    });
  }
});

export default healthRouter;