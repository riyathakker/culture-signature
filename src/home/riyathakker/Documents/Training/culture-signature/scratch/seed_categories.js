const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Rings" },
    { name: "Necklaces" },
    { name: "Earrings" },
    { name: "Bracelets" },
    { name: "Timepieces" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: "" }, // Not useful for upserting by name, but we can check if it exists
      update: {},
      create: category,
    });
  }

  // Better way to upsert by name if we add @unique to name in schema, but for now:
  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
        where: { name: cat.name }
    });
    if (!existing) {
        await prisma.category.create({ data: cat });
    }
  }

  console.log("Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
