import { z } from "zod";
import { dmmf } from "@prisma/client";

/**
 * Maps Prisma scalar types to Zod schemas
 */
const prismaToZodMap: Record<string, string> = {
  String: "z.string()",
  Int: "z.number().int()",
  Float: "z.number()",
  Boolean: "z.boolean()",
  DateTime: "z.date()",
  Json: "z.any()",
};

/**
 * Generate Zod schema from a Prisma model
 * @param model Prisma model metadata
 * @returns Zod schema as a string
 */
export const generateZodSchema = (model: (typeof dmmf.datamodel.models)[0]): string => {
  const schemaFields: string[] = model.fields.map((field: (typeof dmmf.datamodel.models)[0]["fields"][0]) => {
    let zodType = prismaToZodMap[field.type] || "z.any()"; // Default to z.any() for unsupported types

    // Handle array types (e.g., Int[], String[])
    if (field.type.endsWith("[]")) {
      const baseType = field.type.replace("[]", ""); // Extract base type (e.g., Int from Int[])
      const baseZodType = prismaToZodMap[baseType] || "z.any()"; // Map base type to Zod
      zodType = `z.array(${baseZodType})`;
    }

    const optional = field.isRequired ? "" : ".optional()"; // Optional if the field is not required
    return `  ${field.name}: ${zodType}${optional},`;
  });

  return `import { z } from 'zod';

export const ${model.name}Schema = z.object({
${schemaFields.join("\n")}
});`;
};
