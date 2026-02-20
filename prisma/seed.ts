import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || "changeme123", 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_SEED_EMAIL || "admin@coloradocouchranch.com" },
    update: {},
    create: {
      email: process.env.ADMIN_SEED_EMAIL || "admin@coloradocouchranch.com",
      password: adminPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // Create sales user
  const salesPassword = await bcrypt.hash("sales123", 12);
  const sales = await prisma.user.upsert({
    where: { email: "sales@coloradocouchranch.com" },
    update: {},
    create: {
      email: "sales@coloradocouchranch.com",
      password: salesPassword,
      name: "Sales Team",
      role: "sales",
    },
  });
  console.log(`Sales user created: ${sales.email}`);

  // Create sample couches
  const couches = [
    {
      title: "Cloud Modular Sectional - 6 Piece",
      style: "classic_modular",
      color: "Gray",
      fabricType: "Performance Fabric",
      length: 132,
      width: 100,
      height: 34,
      buyPrice: 400,
      sellPrice: 1200,
      status: "available",
      featured: true,
      notes: "Restored RH Cloud style modular. All sections in excellent condition. Deep, comfortable seating.",
    },
    {
      title: "Pottery Barn U-Shape Sectional",
      style: "u_shape",
      color: "Beige",
      fabricType: "Linen Blend",
      length: 140,
      width: 110,
      height: 36,
      buyPrice: 350,
      sellPrice: 950,
      status: "available",
      featured: true,
      notes: "Beautiful U-shape configuration. Perfect for large living rooms. Minimal wear.",
    },
    {
      title: "West Elm L-Shape Sleeper",
      style: "l_shape",
      color: "Navy",
      fabricType: "Velvet",
      length: 108,
      width: 80,
      height: 32,
      buyPrice: 300,
      sellPrice: 850,
      status: "available",
      featured: true,
      notes: "Sleeper mechanism works perfectly. Queen-size pull-out bed. Modern design.",
    },
    {
      title: "Ashley Reclining Sectional",
      style: "reclining",
      color: "Brown",
      fabricType: "Leather",
      length: 120,
      width: 95,
      height: 40,
      buyPrice: 250,
      sellPrice: 750,
      status: "available",
      featured: false,
      notes: "Power reclining on both ends. Genuine leather. A few minor scratches on the armrests.",
    },
    {
      title: "IKEA Kivik Sofa",
      style: "sofa",
      color: "Cream",
      fabricType: "Cotton",
      length: 90,
      width: 38,
      height: 32,
      buyPrice: 100,
      sellPrice: 350,
      status: "available",
      featured: false,
      notes: "Clean, well-maintained. Covers are machine washable.",
    },
  ];

  for (const couch of couches) {
    await prisma.couch.create({ data: couch });
  }
  console.log(`Created ${couches.length} sample couches`);

  // Create sample marketing links
  await prisma.marketingLink.create({
    data: {
      name: "Facebook - Main Inventory Post",
      slug: "fb-main",
      destination: "/inventory",
      platform: "facebook",
      campaign: "General",
      clicks: 45,
      leads: 8,
      sales: 3,
    },
  });

  await prisma.marketingLink.create({
    data: {
      name: "Instagram Bio Link",
      slug: "ig-bio",
      destination: "/inventory",
      platform: "instagram",
      campaign: "Bio Link",
      clicks: 120,
      leads: 15,
      sales: 5,
    },
  });
  console.log("Created sample marketing links");

  // Create sample inquiry
  await prisma.customerInquiry.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "303-555-0123",
      preferredStyle: "classic_modular",
      preferredColor: "Gray",
      budgetMin: 800,
      budgetMax: 1500,
      message: "Looking for a large modular sectional for our new living room. Open to different configurations.",
      source: "fb-main",
    },
  });
  console.log("Created sample inquiry");

  // Create sample buy request
  await prisma.buyRequest.create({
    data: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "720-555-0456",
      brand: "Restoration Hardware",
      style: "classic_modular",
      color: "Tan",
      condition: "good",
      age: "3 years",
      askingPrice: 500,
      description: "Moving and need to sell. RH Cloud modular, 5 pieces. Some light wear but overall great condition.",
    },
  });
  console.log("Created sample buy request");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
