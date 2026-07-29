import 'dotenv/config';
import { defineConfig } from '@prisma-next/postgres/config';

export default defineConfig({
  contract: "./lib/prisma/schema.prisma",
  db: {
    connection: process.env['DATABASE_URL']!,
  },
});
