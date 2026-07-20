import bcrypt from "bcryptjs";

export default async function admins(prisma) {
  const admins = [
    { name: "Admin", email: "riyathakker1329@gmail.com", password: "Admin@1234" },
    { name: "Admin", email: "admin@culturesignature.com", password: "Admin@1234" },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { name: admin.name, password: hashedPassword, role: "ADMIN", isDeleted: false },
      create: { name: admin.name, email: admin.email, password: hashedPassword, role: "ADMIN" },
    });
  }

  console.log("Admins seeded successfully");
}
