import { PrismaClient } from "@prisma/client";
import categories from "./seed/categories.js";

const prisma = new PrismaClient();

async function main() {
  await categories(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });