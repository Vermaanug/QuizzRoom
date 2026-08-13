import { prisma } from "./prisma.js";

export const connectDb = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
  } catch (error) {
    console.error("Error connecting to PostgreSQL via Prisma:", error);
    throw error;
  }
};
