import { readdirSync, existsSync } from "fs";
import { join } from "path";

const schemasDir = join(__dirname, "../../prisma-zod-schemas");

// Dynamically export all schemas if the directory exists
if (existsSync(schemasDir)) {
  const schemaFiles = readdirSync(schemasDir).filter((file) => file.endsWith(".ts"));
  schemaFiles.forEach((file) => {
    const schemaName = file.replace("Schema.ts", "");
    const schemaModule = require(`../../prisma-zod-schemas/${schemaName}Schema`);
    Object.keys(schemaModule).forEach((key) => {
      exports[key] = schemaModule[key];
    });
  });
}
