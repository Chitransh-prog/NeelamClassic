import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { prisma, withDbRetry } from "../lib/prisma";
import { GALLERY_ITEMS } from "../data/services";

async function syncGallery() {
  console.log(`Starting sync of ${GALLERY_ITEMS.length} gallery items into Database...`);

  let count = 0;
  for (let idx = 0; idx < GALLERY_ITEMS.length; idx++) {
    const item = GALLERY_ITEMS[idx];

    await withDbRetry(async () => {
      await prisma.galleryItem.upsert({
        where: { id: item.id },
        update: {
          title: item.title,
          category: item.category,
          mediaType: "image",
          url: item.src,
          altText: item.alt,
          sortOrder: idx,
        },
        create: {
          id: item.id,
          title: item.title,
          category: item.category,
          mediaType: "image",
          url: item.src,
          altText: item.alt,
          sortOrder: idx,
          isFeatured: true,
        },
      });
    });

    console.log(`[${idx + 1}/${GALLERY_ITEMS.length}] Synced: ${item.title} (${item.category}) -> ${item.src}`);
    count++;
  }

  console.log(`\n Successfully synced all ${count} gallery items to admin database!`);
}

syncGallery()
  .catch((e) => {
    console.error("Error syncing gallery items:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
