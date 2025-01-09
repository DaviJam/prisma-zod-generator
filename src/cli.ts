#!/usr/bin/env node

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { PrismaClient, dmmf } from "@prisma/client";
import { generateZodSchema } from "./prismaToZod";

const prisma = new PrismaClient();

// Main function to generate Zod schemas
const run = async () => {
  console.log("Prisma to Zod: Starting schema generation...");

  // Define the output directory
  const outputDir = join(process.cwd(), "prisma-zod-schemas");
  mkdirSync(outputDir, { recursive: true });

  // Generate Zod schemas for each model
  dmmf.datamodel.models.forEach((model: (typeof dmmf.datamodel.models)[0]) => {
    const schemaContent = generateZodSchema(model);
    const schemaFilePath = join(outputDir, `${model.name}Schema.ts`);
    writeFileSync(schemaFilePath, schemaContent, "utf8");
    console.log(`Generated schema for model: ${model.name}`);
  });

  console.log("Zod schemas generated successfully in:", outputDir);
};

run().catch((error) => {
  console.error("Error generating Zod schemas:", error);
  process.exit(1);
});
