import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/eduquest";

// Create a connection pool
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Create a single instance of PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;

// Export types for convenience
export type { Prisma } from "@prisma/client";
