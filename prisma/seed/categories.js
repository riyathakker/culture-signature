export default async function categories(prisma) {
  const categories = [
    { name: "Rings" },
    { name: "Neck Pieces" },
    { name: "Earrings" },
    { name: "Hand Accessories" },
    { name: "Afghani Jewellery" },
    { name: "Bags" },
    { name: "Home Decor" },
    { name: "Gifting" },
    { name: "Saree Collection" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {},
      create: category,
    });
  }

  console.log("Categories seeded successfully");
}