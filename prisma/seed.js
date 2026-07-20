import { PrismaClient } from "@prisma/client";
import categories from "./seed/categories.js";
import admins from "./seed/admins.js";

const prisma = new PrismaClient();

async function main() {
  await categories(prisma);
  await admins(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });