/**
 * Database Seeding Script for NeonDB
 * 
 * This script populates the database with initial data for development and demo purposes.
 * Run with: npm run db:seed
 */

import { db } from '../server/db';
import { users, products, categories, distributorLeads } from '../shared/schema';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('[SEED] Starting database seeding...');

  try {
    // Clear existing data (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[SEED] Clearing existing data...');
      await db.delete(distributorLeads);
      await db.delete(products);
      await db.delete(categories);
      await db.delete(users);
    }

    // Seed Categories
    console.log('[SEED] Creating categories...');
    const categoryData = [
      {
        name: "Supplements",
        slug: "supplements",
        description: "Natural health supplements and vitamins for optimal wellness",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
        productCount: 0
      },
      {
        name: "Herbal Teas",
        slug: "herbal-teas",
        description: "Premium organic herbal teas for relaxation and health",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        productCount: 0
      },
      {
        name: "Essential Oils",
        slug: "essential-oils",
        description: "Pure essential oils for aromatherapy and wellness",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
        productCount: 0
      },
      {
        name: "Skincare",
        slug: "skincare",
        description: "Natural skincare products for healthy, glowing skin",
        imageUrl: "https://images.unsplash.com/photo-1556228578-dd6acbc5b3b5",
        productCount: 0
      }
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`[SEED] Created ${insertedCategories.length} categories`);

    // Seed Products
    console.log('[SEED] Creating products...');
    const productData = [
      {
        name: "Premium Turmeric Curcumin",
        description: "High-potency turmeric supplement with black pepper extract for enhanced absorption. Supports joint health, reduces inflammation, and provides powerful antioxidant benefits.",
        shortDescription: "High-potency turmeric with enhanced absorption",
        price: "29.99",
        categoryId: insertedCategories[0].id, // Supplements
        imageUrl: "https://images.unsplash.com/photo-1584308072243-4dd2c7ad7ac2",
        inStock: true,
        featured: true,
        rating: "4.8",
        reviewCount: 245
      },
      {
        name: "Organic Ashwagandha Root",
        description: "Premium organic ashwagandha root extract standardized to 5% withanolides. Helps manage stress, supports adrenal function, and promotes restful sleep.",
        shortDescription: "Premium organic ashwagandha for stress support",
        price: "24.99",
        categoryId: insertedCategories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        inStock: true,
        featured: true,
        rating: "4.7",
        reviewCount: 189
      },
      {
        name: "Calm Mind Herbal Tea",
        description: "A soothing blend of chamomile, passionflower, and lemon balm designed to promote relaxation and peaceful sleep. Perfect for evening wind-down routines.",
        shortDescription: "Soothing blend for relaxation and sleep",
        price: "18.99",
        categoryId: insertedCategories[1].id, // Herbal Teas
        imageUrl: "https://images.unsplash.com/photo-1587593810167-a84920ea0781",
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 156
      },
      {
        name: "Energy Boost Green Tea",
        description: "Energizing blend of organic green tea, ginseng, and natural herbs. Provides sustained energy without jitters, packed with antioxidants and natural caffeine.",
        shortDescription: "Energizing green tea blend with ginseng",
        price: "21.99",
        categoryId: insertedCategories[1].id,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
        inStock: true,
        featured: true,
        rating: "4.5",
        reviewCount: 203
      },
      {
        name: "Pure Lavender Essential Oil",
        description: "100% pure therapeutic-grade lavender essential oil from French Provence. Perfect for aromatherapy, relaxation, and natural skincare applications.",
        shortDescription: "100% pure therapeutic-grade lavender oil",
        price: "32.99",
        categoryId: insertedCategories[2].id, // Essential Oils
        imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 312
      },
      {
        name: "Peppermint Essential Oil",
        description: "Invigorating peppermint essential oil with a fresh, cooling aroma. Excellent for mental clarity, digestive support, and natural cleaning applications.",
        shortDescription: "Invigorating peppermint oil for clarity",
        price: "19.99",
        categoryId: insertedCategories[2].id,
        imageUrl: "https://images.unsplash.com/photo-1595016775342-d8c2a3d0b5c3",
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 178
      },
      {
        name: "Nourishing Face Serum",
        description: "Lightweight, fast-absorbing serum with hyaluronic acid, vitamin C, and botanical extracts. Hydrates, brightens, and protects skin for a healthy glow.",
        shortDescription: "Hydrating serum with vitamin C and botanicals",
        price: "45.99",
        categoryId: insertedCategories[3].id, // Skincare
        imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
        inStock: true,
        featured: true,
        rating: "4.8",
        reviewCount: 267
      },
      {
        name: "Gentle Cleansing Oil",
        description: "Luxurious cleansing oil that effortlessly removes makeup and impurities while nourishing the skin. Suitable for all skin types, including sensitive skin.",
        shortDescription: "Luxurious cleansing oil for all skin types",
        price: "38.99",
        categoryId: insertedCategories[3].id,
        imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
        inStock: false,
        featured: false,
        rating: "4.6",
        reviewCount: 134
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`[SEED] Created ${insertedProducts.length} products`);

    // Update category product counts
    console.log('[SEED] Updating category product counts...');
    for (const category of insertedCategories) {
      const productCount = insertedProducts.filter(p => p.categoryId === category.id).length;
      await db
        .update(categories)
        .set({ productCount })
        .where({ id: category.id });
    }

    // Seed Demo User
    console.log('[SEED] Creating demo user...');
    const hashedPassword = await bcrypt.hash('demo123', 12);
    const [demoUser] = await db.insert(users).values({
      email: 'demo@naturevital.com',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      createdAt: new Date()
    }).returning();
    console.log(`[SEED] Created demo user: ${demoUser.email}`);

    // Seed Sample Distributor Lead
    console.log('[SEED] Creating sample distributor lead...');
    await db.insert(distributorLeads).values({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0123',
      experience: 'Former health coach with 5+ years in wellness industry',
      motivation: 'Passionate about natural health and helping others achieve wellness goals',
      status: 'pending',
      createdAt: new Date()
    });

    console.log('[SEED] Database seeding completed successfully!');
    console.log('[SEED] Demo credentials: demo@naturevital.com / demo123');

  } catch (error) {
    console.error('[SEED] Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('[SEED] Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[SEED] Seeding failed:', error);
    process.exit(1);
  });