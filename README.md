# Prisma Zod Generator

This library generates Zod schemas dynamically from Prisma models.

## Features
- CLI tool to generate Zod schemas for all Prisma models.
- Automatically maps Prisma scalar types to Zod types.
- Easy integration with Next.js, React, and TypeScript projects.

## Installation

```bash
npm install prisma-zod-generator
```

## Usage

1. Add Prisma models to your schema.
2. Run the CLI:
   ```bash
   npx prismaToZod
   ```
3. Use the generated schemas in your project:
   ```typescript
   import { UserSchema } from 'prisma-zod-schemas/UserSchema';

   const user = UserSchema.parse({ id: 1, name: 'Alice' });
   console.log(user);
   ```

## License
MIT
