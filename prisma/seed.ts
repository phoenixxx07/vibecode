import {

  PrismaClient,

  ProductStatus,

  UserRole,

} from "@prisma/client";



const prisma = new PrismaClient();



const CATEGORIES = [

  { name: "AI Agents", slug: "ai-agents", icon: "smart_toy" },

  { name: "Terminal UI", slug: "terminal-ui", icon: "terminal" },

  { name: "Build Tools", slug: "build-tools", icon: "build" },

  { name: "Doc Processing", slug: "doc-processing", icon: "description" },

  { name: "Frameworks", slug: "frameworks", icon: "layers" },

];



const AI_TOOLS = [

  { name: "Cursor", website: "https://cursor.com" },

  { name: "Bolt", website: "https://bolt.new" },

  { name: "Lovable", website: "https://lovable.dev" },

  { name: "v0", website: "https://v0.dev" },

  { name: "Replit", website: "https://replit.com" },

  { name: "Claude", website: "https://claude.ai" },

  { name: "GitHub Copilot", website: "https://github.com/features/copilot" },

  { name: "Windsurf", website: "https://codeium.com/windsurf" },

  { name: "Gemini", website: "https://gemini.google.com" },

  { name: "ChatGPT", website: "https://chat.openai.com" },

];



const METADATA_OPTIONS = [

  { type: "project_type" as const, value: "live", label: "Live — produk online", sortOrder: 0 },

  { type: "project_type" as const, value: "prototype", label: "Prototype — demo/MVP", sortOrder: 1 },

  { type: "project_type" as const, value: "repository", label: "Repository — GitHub", sortOrder: 2 },

  { type: "platform" as const, value: "web", label: "Web", sortOrder: 0 },

  { type: "platform" as const, value: "mobile", label: "Mobile", sortOrder: 1 },

  { type: "platform" as const, value: "desktop", label: "Desktop", sortOrder: 2 },

  { type: "platform" as const, value: "extension", label: "Extension", sortOrder: 3 },

  { type: "pricing_type" as const, value: "free", label: "Gratis", sortOrder: 0 },

  { type: "pricing_type" as const, value: "freemium", label: "Freemium", sortOrder: 1 },

  { type: "pricing_type" as const, value: "paid", label: "Berbayar", sortOrder: 2 },

  { type: "pricing_type" as const, value: "contact_for_price", label: "Hubungi untuk harga", sortOrder: 3 },

];



const DEMO_PRODUCTS = [

  {

    name: "PromptForge ID",

    tagline: "Generator prompt Bahasa Indonesia untuk vibe coding",

    url: "https://example.com/promptforge",

    projectType: "live",

    highlight1: "Template prompt siap pakai",

    highlight2: "Dukungan Bahasa Indonesia",

    highlight3: "Export ke Cursor & Bolt",

    platforms: ["web"],

    pricingType: "free",

    developerContact: "promptforge@example.com",

    categorySlug: "ai-agents",

    aiTools: ["Cursor", "Bolt"],

  },

  {

    name: "TerminalKit",

    tagline: "Komponen UI terminal untuk React",

    url: "https://example.com/terminalkit",

    projectType: "prototype",

    highlight1: "Komponen CLI-style",

    highlight2: "Dark mode bawaan",

    highlight3: "Zero config setup",

    platforms: ["web"],

    pricingType: "freemium",

    pricingNote: "Gratis untuk open source",

    developerContact: "@terminalkit_dev",

    categorySlug: "terminal-ui",

    aiTools: ["v0", "Lovable"],

  },

  {

    name: "VibeStack Boilerplate",

    tagline: "Starter Next.js untuk produk lokal",

    url: "https://github.com/example/vibestack",

    githubUrl: "https://github.com/example/vibestack",

    projectType: "repository",

    highlight1: "Auth + Prisma included",

    highlight2: "Tailwind terminal theme",

    highlight3: "Deploy-ready",

    platforms: ["web"],

    developerContact: "hello@example.com",

    categorySlug: "frameworks",

    aiTools: ["Cursor", "Claude"],

  },

  {

    name: "DocuParse ID",

    tagline: "Ekstrak data dari PDF berbahasa Indonesia",

    url: "https://example.com/docuparse",

    projectType: "live",

    highlight1: "OCR Bahasa Indonesia",

    highlight2: "API REST sederhana",

    highlight3: "Batch processing",

    platforms: ["web", "extension"],

    pricingType: "paid",

    priceAmount: 99000,

    pricingNote: "Mulai Rp 99rb/bulan",

    developerContact: "sales@docuparse.id",

    categorySlug: "doc-processing",

    aiTools: ["Claude", "Gemini"],

  },

  {

    name: "BuildFlow CLI",

    tagline: "Otomasi deploy untuk vibe projects",

    url: "https://example.com/buildflow",

    projectType: "prototype",

    highlight1: "One-command deploy",

    highlight2: "Docker support",

    highlight3: "Env management",

    platforms: ["desktop", "web"],

    developerContact: "buildflow@example.com",

    categorySlug: "build-tools",

    aiTools: ["Replit", "GitHub Copilot"],

  },

];



async function seedAdmin() {

  const email = process.env.SEED_ADMIN_EMAIL;

  if (!email) {

    throw new Error("SEED_ADMIN_EMAIL is required for database seed");

  }



  const name = process.env.SEED_ADMIN_NAME ?? "VibeCatalog Admin";

  const existing = await prisma.user.findUnique({

    where: { email },

    include: { accounts: { select: { id: true } } },

  });



  if (existing) {

    await prisma.user.update({

      where: { email },

      data: { role: UserRole.admin, name },

    });

    console.log(`Admin role applied to existing user: ${email}`);

    return;

  }



  console.log(`Admin will be assigned on first Google login: ${email}`);

}



async function seedCategories() {

  for (const cat of CATEGORIES) {

    await prisma.category.upsert({

      where: { slug: cat.slug },

      update: { name: cat.name, icon: cat.icon },

      create: cat,

    });

  }

  console.log(`Categories seeded: ${CATEGORIES.length}`);

}



async function seedAiTools() {

  for (const tool of AI_TOOLS) {

    await prisma.aiTool.upsert({

      where: { name: tool.name },

      update: { website: tool.website },

      create: { ...tool, isApproved: true },

    });

  }

  console.log(`AI tools seeded: ${AI_TOOLS.length}`);

}



async function seedMetadataOptions() {

  for (const option of METADATA_OPTIONS) {

    await prisma.metadataOption.upsert({

      where: {

        type_value: { type: option.type, value: option.value },

      },

      update: { label: option.label, sortOrder: option.sortOrder, isActive: true },

      create: option,

    });

  }

  console.log(`Metadata options seeded: ${METADATA_OPTIONS.length}`);

}



async function seedDemoProducts() {

  const shouldSeed =

    process.env.NODE_ENV === "development" ||

    process.env.SEED_DEMO_DATA === "true";



  if (!shouldSeed) {

    console.log("Skipping demo products (set SEED_DEMO_DATA=true to enable)");

    return;

  }



  const adminEmail = process.env.SEED_ADMIN_EMAIL!;

  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) return;



  const existing = await prisma.product.count();

  if (existing > 0) {

    console.log("Demo products already exist, skipping");

    return;

  }



  for (const demo of DEMO_PRODUCTS) {

    const category = await prisma.category.findUnique({

      where: { slug: demo.categorySlug },

    });

    if (!category) continue;



    const aiToolRecords = await prisma.aiTool.findMany({

      where: { name: { in: demo.aiTools } },

    });



    await prisma.product.create({

      data: {

        userId: admin.id,

        name: demo.name,

        tagline: demo.tagline,

        url: demo.url,

        githubUrl: demo.githubUrl,

        projectType: demo.projectType,

        screenshotUrl: "/placeholder-project.svg",

        highlight1: demo.highlight1,

        highlight2: demo.highlight2,

        highlight3: demo.highlight3,

        platforms: demo.platforms,

        techStack: [],

        pricingType: demo.pricingType,

        priceAmount: demo.priceAmount,

        pricingNote: demo.pricingNote,

        developerContact: demo.developerContact,

        status: ProductStatus.approved,

        isFeatured: Math.random() > 0.6,

        upvoteCount: Math.floor(Math.random() * 50),

        viewCount: Math.floor(Math.random() * 200),

        categories: {

          create: [{ categoryId: category.id }],

        },

        aiTools: {

          create: aiToolRecords.map((t) => ({ aiToolId: t.id })),

        },

      },

    });

  }



  console.log(`Demo products seeded: ${DEMO_PRODUCTS.length}`);

}



async function main() {

  await seedAdmin();

  await seedCategories();

  await seedAiTools();

  await seedMetadataOptions();

  await seedDemoProducts();

}



main()

  .catch((e) => {

    console.error(e);

    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });

