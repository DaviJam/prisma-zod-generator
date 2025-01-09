import { generateZodSchema } from "../src/prismaToZod";

describe("Prisma to Zod Schema Generator", () => {
  // Mock models for tests
  const mockSimpleModel = {
    name: "User",
    fields: [
      { name: "id", type: "Int", isRequired: true },
      { name: "name", type: "String", isRequired: true },
      { name: "email", type: "String", isRequired: false },
    ],
  };

  const mockComplexModel = {
    name: "Product",
    fields: [
      { name: "id", type: "Int", isRequired: true },
      { name: "name", type: "String", isRequired: true },
      { name: "price", type: "Float", isRequired: true },
      { name: "description", type: "String", isRequired: false },
      { name: "tags", type: "Json", isRequired: false },
    ],
  };

  const mockArrayModel = {
    name: "Order",
    fields: [
      { name: "id", type: "Int", isRequired: true },
      { name: "items", type: "Json", isRequired: true },
      { name: "customerIds", type: "Int[]", isRequired: true },
    ],
  };

  const mockUnsupportedTypeModel = {
    name: "UnsupportedTypeModel",
    fields: [
      { name: "id", type: "Int", isRequired: true },
      { name: "unknownField", type: "UnknownType", isRequired: false },
    ],
  };

  it("should generate a valid Zod schema for a simple model", () => {
    const schema = generateZodSchema(mockSimpleModel as any);
    expect(schema).toContain("id: z.number().int()");
    expect(schema).toContain("name: z.string()");
    expect(schema).toContain("email: z.string().optional()");
  });

  it("should generate a valid Zod schema for a complex model", () => {
    const schema = generateZodSchema(mockComplexModel as any);
    expect(schema).toContain("id: z.number().int()");
    expect(schema).toContain("name: z.string()");
    expect(schema).toContain("price: z.number()");
    expect(schema).toContain("description: z.string().optional()");
    expect(schema).toContain("tags: z.any().optional()");
  });

  it("should handle array fields properly", () => {
    const schema = generateZodSchema(mockArrayModel as any);
    expect(schema).toContain("id: z.number().int()");
    expect(schema).toContain("items: z.any()");
    expect(schema).toContain("customerIds: z.array(z.number().int())");
  });

  it("should handle unsupported field types gracefully", () => {
    const schema = generateZodSchema(mockUnsupportedTypeModel as any);
    expect(schema).toContain("id: z.number().int()");
    expect(schema).toContain("unknownField: z.any().optional()");
  });

  it("should handle an empty model gracefully", () => {
    const emptyModel = { name: "Empty", fields: [] };
    const schema = generateZodSchema(emptyModel as any);
    expect(schema).toContain("z.object({");
    expect(schema).toContain("});");
  });

  it("should generate a valid schema with nested relations (mocked)", () => {
    const mockRelationModel = {
      name: "Post",
      fields: [
        { name: "id", type: "Int", isRequired: true },
        { name: "title", type: "String", isRequired: true },
        { name: "author", type: "User", isRequired: true }, // Mocking a nested relation
      ],
    };

    const schema = generateZodSchema(mockRelationModel as any);
    expect(schema).toContain("id: z.number().int()");
    expect(schema).toContain("title: z.string()");
    expect(schema).toContain("author: z.any()"); // Nested relations default to `z.any()`
  });
});
