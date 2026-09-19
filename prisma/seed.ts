import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Listrik", slug: "listrik", icon: "zap" },
  { name: "Ledeng & Pipa", slug: "ledeng", icon: "droplet" },
  { name: "Cat & Finishing", slug: "cat", icon: "paint" },
  { name: "AC & Pendingin", slug: "ac", icon: "wind" },
  { name: "Renovasi & Bangunan", slug: "renovasi", icon: "hammer" },
  { name: "Kebersihan", slug: "kebersihan", icon: "sparkles" },
  { name: "Furniture & Interior", slug: "furniture", icon: "sofa" },
  { name: "Taman & Outdoor", slug: "taman", icon: "leaf" },
];

const mitraSeeds = [
  {
    name: "Budi Santoso",
    phone: "081234567801",
    businessName: "Budi Listrik Jaya",
    city: "Jakarta Selatan",
    categorySlug: "listrik",
    bio: "Spesialis instalasi & perbaikan listrik rumah/kantor, 10 tahun pengalaman.",
    years: 10,
    services: [
      { title: "Perbaikan Instalasi Listrik", priceMin: 100000, priceMax: 300000 },
      { title: "Pasang Titik Lampu Baru", priceMin: 75000, priceMax: 150000 },
    ],
  },
  {
    name: "Siti Rahma",
    phone: "081234567802",
    businessName: "Rahma Plumbing",
    city: "Tangerang",
    categorySlug: "ledeng",
    bio: "Ahli perbaikan pipa bocor, saluran mampet, dan instalasi air bersih.",
    years: 7,
    services: [
      { title: "Perbaikan Pipa Bocor", priceMin: 80000, priceMax: 250000 },
      { title: "Buka Saluran Mampet", priceMin: 100000, priceMax: 200000 },
    ],
  },
  {
    name: "Agus Wijaya",
    phone: "081234567803",
    businessName: "Agus Cat Profesional",
    city: "Bekasi",
    categorySlug: "cat",
    bio: "Jasa cat rumah interior & eksterior, hasil rapi dan tahan lama.",
    years: 8,
    services: [
      { title: "Cat Ulang Rumah 1 Lantai", priceMin: 2000000, priceMax: 5000000 },
      { title: "Cat Ruangan (per ruangan)", priceMin: 500000, priceMax: 1200000 },
    ],
  },
  {
    name: "Dewi Lestari",
    phone: "081234567804",
    businessName: "Dewi AC Service",
    city: "Jakarta Barat",
    categorySlug: "ac",
    bio: "Cuci AC, isi freon, dan perbaikan AC semua merk.",
    years: 6,
    services: [
      { title: "Cuci AC Standar", priceMin: 60000, priceMax: 90000 },
      { title: "Isi Freon + Cek Kebocoran", priceMin: 150000, priceMax: 300000 },
    ],
  },
  {
    name: "Hendra Kusuma",
    phone: "081234567805",
    businessName: "Hendra Renovasi",
    city: "Depok",
    categorySlug: "renovasi",
    bio: "Renovasi rumah, bangun sekat, dan perbaikan struktur bangunan.",
    years: 12,
    services: [
      { title: "Renovasi Kamar Mandi", priceMin: 3000000, priceMax: 8000000 },
      { title: "Bangun Sekat Ruangan", priceMin: 1500000, priceMax: 4000000 },
    ],
  },
  {
    name: "Rina Marlina",
    phone: "081234567806",
    businessName: "Rina Cleaning Service",
    city: "Jakarta Timur",
    categorySlug: "kebersihan",
    bio: "Jasa bersih rumah, deep cleaning, dan cuci sofa/karpet.",
    years: 5,
    services: [
      { title: "Deep Cleaning Rumah", priceMin: 250000, priceMax: 600000 },
      { title: "Cuci Sofa & Karpet", priceMin: 100000, priceMax: 350000 },
    ],
  },
];

async function main() {
  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  console.log("Seeding admin user...");
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { phone: "080000000000" },
    update: {},
    create: {
      name: "Admin Ekamatra",
      phone: "080000000000",
      email: "admin@ekamatra.local",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log("Seeding mitra & services...");
  for (const m of mitraSeeds) {
    const category = await prisma.category.findUnique({
      where: { slug: m.categorySlug },
    });
    if (!category) continue;

    const passwordHash = await bcrypt.hash("mitra123", 10);
    const user = await prisma.user.upsert({
      where: { phone: m.phone },
      update: {},
      create: {
        name: m.name,
        phone: m.phone,
        passwordHash,
        role: "MITRA",
      },
    });

    const mitra = await prisma.mitraProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: m.businessName,
        bio: m.bio,
        city: m.city,
        whatsappNumber: m.phone,
        isVerified: true,
        yearsExperience: m.years,
        ratingAvg: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50) + 5,
      },
    });

    for (const s of m.services) {
      const existing = await prisma.service.findFirst({
        where: { mitraId: mitra.id, title: s.title },
      });
      if (!existing) {
        await prisma.service.create({
          data: {
            mitraId: mitra.id,
            categoryId: category.id,
            title: s.title,
            priceMin: s.priceMin,
            priceMax: s.priceMax,
          },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
