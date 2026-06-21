import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import CMSPage from '../models/CMSPage';
import CMSSection from '../models/CMSSection';
import Review from '../models/Review';
import Order from '../models/Order';

dotenv.config();

const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/velora';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(connUri);
    console.log('Connected to DB for seeding. Clearing existing data...');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await CMSPage.deleteMany({});
    await CMSSection.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    console.log('Database cleared. Seeding Users...');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const users = await User.create([
      {
        name: 'Velora Admin',
        email: 'admin@velora.com',
        password: adminPassword,
        role: 'admin',
        phone: '9999999999',
        addresses: [
          {
            street: '101, Science Park Lane',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India',
            isDefault: true
          }
        ]
      },
      {
        name: 'Amit Kumar',
        email: 'user@velora.com',
        password: userPassword,
        role: 'user',
        phone: '8888888888',
        addresses: [
          {
            street: 'Flat 402, Green Meadows',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India',
            isDefault: true
          }
        ]
      }
    ]);

    console.log('Users seeded. Seeding Coupons...');

    const coupons = await Coupon.create([
      {
        code: 'VELORA10',
        discountType: 'Percentage',
        discountValue: 10,
        minOrderValue: 500,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isActive: true
      },
      {
        code: 'WELCOME500',
        discountType: 'Fixed',
        discountValue: 500,
        minOrderValue: 2000,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true
      }
    ]);

    console.log('Coupons seeded. Seeding Products...');

    const products = await Product.create([
      {
        title: 'Vitamin C 15% Daily Radiance Serum',
        slug: 'vitamin-c-15-radiance-serum',
        category: 'Skin Care',
        concern: ['Acne', 'Pigmentation', 'Dark Circles'],
        skinType: ['Oily', 'Dry', 'Combination', 'Sensitive', 'All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 999,
        salePrice: 799,
        stock: 50,
        images: [
          '/images/vitamin_c_serum.webp'
        ],
        beforeAfterImages: [
          '/images/vitamin_c_serum.webp'
        ],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        benefits: [
          'Brightens dark spots and post-acne pigmentation',
          'Stimulates collagen synthesis for firm skin texture',
          'Neutralizes environmental free radicals'
        ],
        ingredients: [
          { name: 'Ethyl Ascorbic Acid (Vitamin C)', percentage: '15%', purpose: 'Potent skin brightening antioxidant' },
          { name: 'Ferulic Acid', percentage: '0.5%', purpose: 'Stabilizes Vitamin C and doubles efficacy' },
          { name: 'Hyaluronic Acid', percentage: '1%', purpose: 'Infuses deep surface hydration' }
        ],
        description: 'A daily glow serum packed with highly stable Vitamin C, Ferulic Acid, and Hyaluronic Acid to brighten dull skin, even out tone, and fade stubborn hyperpigmentation without irritation.',
        usageGuide: {
          morning: 'Apply 3-4 drops onto clean, dry skin. Pat gently until absorbed. Always follow up with broad-spectrum SPF.',
          night: 'Can be used at night after cleansing. Follow with a nourishing moisturizer.'
        },
        ratings: { average: 4.8, count: 24 },
        featured: true,
        bestSeller: true,
        newArrival: false,
        seoTitle: 'Vitamin C 15% Glow Serum | Velora Skincare',
        seoDescription: 'Shop our premium 15% Vitamin C Daily Radiance Serum. Fades dark spots, fights acne scars, and enhances natural skin glow. Order online now.'
      },
      {
        title: '2% Salicylic Acid BHA Acne Clarifier',
        slug: 'salicylic-acid-2-acne-clarifier',
        category: 'Skin Care',
        concern: ['Acne', 'Oily Skin'],
        skinType: ['Oily', 'Combination'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 899,
        salePrice: 699,
        stock: 35,
        images: [
          '/images/salicylic_acid.webp'
        ],
        beforeAfterImages: [
          '/images/salicylic_acid.webp'
        ],
        videoUrl: '',
        benefits: [
          'Unclogs deep skin pores and regulates sebum production',
          'Exfoliates dead skin cells to prevent future breakouts',
          'Reduces redness and visible blackheads'
        ],
        ingredients: [
          { name: 'Salicylic Acid', percentage: '2%', purpose: 'Lipophilic BHA that dissolves pore debris' },
          { name: 'Centella Asiatica (Cica)', percentage: '1%', purpose: 'Soothes inflammation and accelerates healing' },
          { name: 'Niacinamide', percentage: '2%', purpose: 'Fades post-inflammatory redness' }
        ],
        description: 'An advanced fast-acting BHA serum targeting breakouts, excess oil, and enlarged pores. Enriched with Centella Asiatica to keep the skin calm and hydrated during exfoliation.',
        usageGuide: {
          morning: 'Not recommended for morning use if spending long hours outdoors.',
          night: 'Apply 2-3 drops to dry skin after cleansing. Start by using 2-3 times a week, gradually increasing to nightly.'
        },
        ratings: { average: 4.7, count: 18 },
        featured: true,
        bestSeller: false,
        newArrival: true,
        seoTitle: '2% Salicylic Acid Acne Serum | Velora',
        seoDescription: 'Banish blackheads, acne, and oily shine with our 2% Salicylic Acid BHA Serum. Dermatologist approved. Order online with secure shipping.'
      },
      {
        title: 'Hyaluronic Deep Hydration Complex',
        slug: 'hyaluronic-deep-hydration-complex',
        category: 'Skin Care',
        concern: ['Dry Skin'],
        skinType: ['Dry', 'Combination', 'Sensitive', 'All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 799,
        salePrice: 649,
        stock: 60,
        images: [
          '/images/hyaluronic_acid.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Multi-molecular weight hyaluronic acid hydrates across all skin layers',
          'Imparts an instant plump, reducing fine dehydration lines',
          'Forms a breathable moisture lock to prevent hydration loss'
        ],
        ingredients: [
          { name: 'Hyaluronic Acid (Multi-weight)', percentage: '2%', purpose: 'Multi-level hydration binding' },
          { name: 'Vitamin B5 (Panthenol)', percentage: '1%', purpose: 'Repairs skin barrier and locks in hydration' }
        ],
        description: 'A skin-drenching hydration boost with multi-molecular hyaluronic acid molecules that penetrate deeply to quench dehydrated skin cells from the inside out.',
        usageGuide: {
          morning: 'Apply 3 drops to slightly damp skin immediately after washing. Follow up with a moisturizer.',
          night: 'Use on damp skin before night creams to boost absorption.'
        },
        ratings: { average: 4.9, count: 42 },
        featured: false,
        bestSeller: true,
        newArrival: false,
        seoTitle: 'Hyaluronic Acid 2% Hydration Serum | Velora',
        seoDescription: 'Plump dry skin instantly with our Multi-Molecular Hyaluronic Acid + Vitamin B5 Complex. Clean, fragrance-free formula.'
      },
      {
        title: 'Biotin & Keratin Anti-Hair Fall Shampoo',
        slug: 'biotin-keratin-anti-hair-fall-shampoo',
        category: 'Hair Care',
        concern: ['Hair Fall', 'Dandruff'],
        skinType: ['All'],
        hairType: ['Straight', 'Wavy', 'Curly', 'Coily', 'All'],
        gender: 'Unisex',
        price: 699,
        salePrice: 599,
        stock: 40,
        images: [
          '/images/biotin_shampoo.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Reduces hair breakage by up to 92%',
          'Fortifies hair roots and thickens individual strands',
          'Cleanses scalp build-up while keeping hair hydrated'
        ],
        ingredients: [
          { name: 'Biotin (Vitamin B7)', percentage: '3%', purpose: 'Stimulates protein synthesis and root strength' },
          { name: 'Hydrolyzed Keratin', percentage: '5%', purpose: 'Restores structural protein to damaged hair shafts' }
        ],
        description: 'A luxury therapeutic shampoo designed to significantly reduce hair fall and split ends. Fortifies the hair cortex from roots to tips for thicker, shinier, and healthier-looking hair.',
        usageGuide: {
          morning: 'Massage into wet hair and scalp. Lather well, leave on for 2 minutes to let actives absorb, then rinse thoroughly.',
          night: ''
        },
        ratings: { average: 4.6, count: 31 },
        featured: true,
        bestSeller: true,
        newArrival: false,
        seoTitle: 'Biotin & Keratin Hair Fall Shampoo | Velora',
        seoDescription: 'Reduce hair breakage and strengthen hair roots with our premium clinical Biotin + Keratin Shampoo. Buy now.'
      },
      {
        title: 'Tea Tree & Salicylic Scalp Cleansing Serum',
        slug: 'tea-tree-salicylic-scalp-serum',
        category: 'Hair Care',
        concern: ['Dandruff', 'Oily Skin'],
        skinType: ['Oily', 'Combination'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 799,
        salePrice: 629,
        stock: 25,
        images: [
          '/images/scalp_serum.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Clears dandruff flakes and scales within 3 washes',
          'Balances scalp sebum and reduces greasy roots',
          'Relieves itching and scalp redness instantly'
        ],
        ingredients: [
          { name: 'Tea Tree Extract', percentage: '2%', purpose: 'Antimicrobial agent that controls dandruff yeasts' },
          { name: 'Salicylic Acid', percentage: '1%', purpose: 'Exfoliates flaky skin build-up from scalp' },
          { name: 'Rosemary Oil', percentage: '0.5%', purpose: 'Invigorates scalp circulation to support growth' }
        ],
        description: 'A clarifying pre-wash scalp serum that targets flakes, itching, and greasy build-up. Formulated with Salicylic Acid to exfoliate and Tea Tree to purify the scalp environment.',
        usageGuide: {
          morning: '',
          night: 'Apply directly to the scalp section by section. Massage gently. Leave on for 30 minutes, then wash off with shampoo.'
        },
        ratings: { average: 4.5, count: 12 },
        featured: false,
        bestSeller: false,
        newArrival: true,
        seoTitle: 'Salicylic Scalp Serum for Dandruff | Velora',
        seoDescription: 'Eliminate itchy dandruff and scale build-up with our pre-wash Salicylic Acid & Tea Tree Scalp Serum.'
      },
      {
        title: 'Premium Cedarwood Beard Growth Elixir',
        slug: 'cedarwood-beard-growth-elixir',
        category: 'Grooming',
        concern: ['Beard Growth', 'Dandruff', 'Dry Skin'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Men',
        price: 899,
        salePrice: 749,
        stock: 30,
        images: [
          '/images/beard_elixir.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Promotes healthy beard growth and fills patchiness',
          'Softens coarse, wiry whiskers for easy styling',
          'Moisturizes underlying skin to banish beard dandruff (beardruff)'
        ],
        ingredients: [
          { name: 'Cedarwood Essential Oil', percentage: '1%', purpose: 'Stimulates hair follicles and provides a premium scent' },
          { name: 'Argan Kernel Oil', percentage: '40%', purpose: 'Deeply softens beard hairs and adds brilliant shine' },
          { name: 'Jojoba Oil', percentage: '30%', purpose: 'Mimics natural skin sebum to lock hydration' }
        ],
        description: 'A non-greasy, intensely nourishing beard oil that promotes beard density, conditions coarse facial hair, and moisturizes the skin below to eliminate flaking.',
        usageGuide: {
          morning: 'Rub 3-5 drops in palms and spread evenly through your beard, massaging into the skin. Comb to style.',
          night: 'Apply before bed to wake up with a soft, hydrated beard.'
        },
        ratings: { average: 4.8, count: 19 },
        featured: true,
        bestSeller: false,
        newArrival: false,
        seoTitle: 'Cedarwood Beard Growth Oil | Velora Men',
        seoDescription: 'Grow a thicker, softer beard. Our Cedarwood & Argan Beard Elixir hydrates skin and fuels growth. Shop the men grooming collection.'
      },
      {
        title: 'Sandalwood & Vetiver Eau de Parfum',
        slug: 'sandalwood-vetiver-eau-de-parfum',
        category: 'Grooming',
        concern: ['Daily Grooming'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 2499,
        salePrice: 1999,
        stock: 15,
        images: [
          '/images/sandalwood_perfume.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Long-lasting formulation remains active for over 10 hours',
          'Premium, warm, woody scent projection',
          'Gentle, hypoallergenic base spray'
        ],
        ingredients: [
          { name: 'Pure Mysore Sandalwood oil', percentage: '5%', purpose: 'Warm, creamy, luxurious base note' },
          { name: 'Haitian Vetiver absolute', percentage: '3%', purpose: 'Earthy, smoky, sophisticated heart note' }
        ],
        description: 'An elevated, gender-neutral fragrance combining warm, creamy Indian Sandalwood with the smoky, earthy undertones of Haitian Vetiver. Complex, comforting, and intensely long-lasting.',
        usageGuide: {
          morning: 'Spray onto pulse points: wrists, neck, and behind ears. Do not rub.',
          night: 'Lightly spritz on clothes or collar before evening events.'
        },
        ratings: { average: 4.9, count: 50 },
        featured: true,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'Sandalwood & Vetiver Luxury Perfume | Velora',
        seoDescription: 'Experience the premium long-lasting warm woody notes of Sandalwood & Vetiver Eau de Parfum. Hand-crafted fragrance collection.'
      },
      {
        title: 'Multi-Peptide & Retinol Wrinkle Repair Cream',
        slug: 'multi-peptide-retinol-wrinkle-repair',
        category: 'Skin Care',
        concern: ['Anti Aging', 'Dry Skin'],
        skinType: ['Dry', 'Combination'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 1299,
        salePrice: 999,
        stock: 20,
        images: [
          '/images/retinol_cream.webp'
        ],
        beforeAfterImages: [
          '/images/retinol_cream.webp'
        ],
        videoUrl: '',
        benefits: [
          'Speeds up cellular turnover to smooth fine lines',
          'Reduces appearance of deep forehead wrinkles in 4 weeks',
          'Imparts deep overnight hydration to restore skin bounce'
        ],
        ingredients: [
          { name: 'Encapsulated Retinol', percentage: '1%', purpose: 'Gentle, slow-release Vitamin A that speeds turnover' },
          { name: 'Matrixyl 3000 (Peptides)', percentage: '3%', purpose: 'Rebuilds collagen and elasticity' },
          { name: 'Ceramides Complex', percentage: '1%', purpose: 'Fortifies the lipid layer to prevent dryness' }
        ],
        description: 'A powerful overnight treatment combining encapsulated Retinol with firming Multi-Peptides. It rebuilds skin architecture, minimizes fine lines, and nourishes the skin barrier overnight with zero flaking.',
        usageGuide: {
          morning: '',
          night: 'Apply a pea-sized amount onto dry face and neck after water-based serums. Always wear SPF the following day.'
        },
        ratings: { average: 4.8, count: 15 },
        featured: false,
        bestSeller: false,
        newArrival: true,
        seoTitle: 'Retinol & Peptides Anti-Aging Cream | Velora',
        seoDescription: 'Firm skin, reduce wrinkles, and boost overnight hydration with our clinical 1% Retinol & Multi-Peptide Repair Cream.'
      },
      {
        title: 'Premium Marine Collagen Skin & Hair Renewal Supplement',
        slug: 'marine-collagen-skin-hair-renewal',
        category: 'Wellness',
        concern: ['Dry Skin', 'Anti Aging', 'Hair Fall'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 1499,
        salePrice: 1199,
        stock: 45,
        images: [
          '/images/marine_collagen.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Promotes skin elasticity and reduces fine lines',
          'Strengthens hair roots and minimizes hair fall',
          'Nourishes nails and supports overall tissue rejuvenation'
        ],
        ingredients: [
          { name: 'Hydrolyzed Marine Collagen Peptides', percentage: '10g', purpose: 'Bioavailable collagen for tissue repair' },
          { name: 'Biotin (Vitamin B7)', percentage: '5000mcg', purpose: 'Supports keratin production' },
          { name: 'Vitamin C', percentage: '40mg', purpose: 'Essential co-factor for collagen synthesis' }
        ],
        description: 'A premium daily wellness supplement containing high-potency marine collagen peptides, biotin, and vitamin C to restore skin elasticity, hydrate cells, and strengthen hair follicles from within.',
        usageGuide: {
          morning: 'Mix 1 scoop (approx. 12g) with water, juice, or your morning smoothie. Stir well and consume.',
          night: ''
        },
        ratings: { average: 4.9, count: 28 },
        featured: true,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'Marine Collagen Peptide Renewal Supplement | Velora',
        seoDescription: 'Restore youthful skin bounce and strong hair. Shop Velora Premium Hydrolyzed Marine Collagen Peptides + Biotin supplement.'
      },
      {
        title: '5% Niacinamide Clarifying Skin Prep Mist',
        slug: 'niacinamide-clarifying-skin-prep-mist',
        category: 'Beauty Essentials',
        concern: ['Acne', 'Oily Skin', 'Pigmentation'],
        skinType: ['Oily', 'Combination', 'Sensitive', 'All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 699,
        salePrice: 549,
        stock: 50,
        images: [
          '/images/niacinamide_mist.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Regulates surface sebum production instantly',
          'Minimizes the appearance of enlarged pores',
          'Preps the skin barrier for active serum absorption'
        ],
        ingredients: [
          { name: 'Niacinamide (Vitamin B3)', percentage: '5%', purpose: 'Strengthens barrier and balances oil' },
          { name: 'Zinc PCA', percentage: '1%', purpose: 'Anti-inflammatory oil regulator' },
          { name: 'Witch Hazel Extract', percentage: '2%', purpose: 'Natural botanical astringent to tighten pores' }
        ],
        description: 'A lightweight, refreshing prep mist that balances oil, tightens pore appearance, and preps the skin barrier for active serum absorption.',
        usageGuide: {
          morning: 'Spray gently over cleansed face before applying serums. Can also be spritzed throughout the day to refresh skin.',
          night: 'Use post-cleansing to balance skin pH before your night routine.'
        },
        ratings: { average: 4.7, count: 19 },
        featured: false,
        bestSeller: false,
        newArrival: true,
        seoTitle: '5% Niacinamide Pore Refining Prep Mist | Velora',
        seoDescription: 'Clarify oily shine and prep your skin with Velora 5% Niacinamide & Zinc PCA Refreshing Mist. Shop beauty essentials.'
      },
      {
        title: 'B5 & Rosemary Root Nourishing Conditioner',
        slug: 'rosemary-root-nourishing-conditioner',
        category: 'Hair Care',
        concern: ['Hair Fall'],
        skinType: ['All'],
        hairType: ['Straight', 'Wavy', 'Curly', 'Coily', 'All'],
        gender: 'Unisex',
        price: 799,
        salePrice: 649,
        stock: 35,
        images: [
          '/images/rosemary_conditioner.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Nourishes and strengthens hair roots',
          'Adds silky softness and brilliant shine without weighing hair down',
          'Prevents split ends and breakage during brushing'
        ],
        ingredients: [
          { name: 'Rosemary Oil', percentage: '1%', purpose: 'Stimulates root circulation' },
          { name: 'Panthenol (Vitamin B5)', percentage: '2%', purpose: 'Locks in hair shaft moisture and elasticity' }
        ],
        description: 'A botanical active conditioner enriched with Rosemary oil and Panthenol to repair damaged hair structures, locking in moisture and preventing tangling.',
        usageGuide: {
          morning: 'After shampooing, apply to hair lengths and ends. Leave on for 2-3 minutes, then rinse thoroughly.',
          night: ''
        },
        ratings: { average: 4.8, count: 16 },
        featured: false,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'B5 & Rosemary Root Conditioner | Velora Haircare',
        seoDescription: 'Nourish hair roots and restore shine. Velora Rosemary Oil & Vitamin B5 conditioner prevents breakage and split ends.'
      },
      {
        title: 'Charcoal & Clay Smoothing Shave Cream',
        slug: 'charcoal-clay-smoothing-shave-cream',
        category: 'Grooming',
        concern: ['Daily Grooming'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Men',
        price: 599,
        salePrice: 449,
        stock: 40,
        images: [
          '/images/charcoal_shave.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Ensures a smooth, irritation-free razor glide',
          'Kaolin clay purifies and detoxifies pores during shaving',
          'Activated charcoal regulates post-shave sebum shine'
        ],
        ingredients: [
          { name: 'Activated Charcoal', percentage: '1%', purpose: 'Draws out dirt and controls shine' },
          { name: 'Kaolin Clay', percentage: '5%', purpose: 'Creates a smooth protective glide shield' }
        ],
        description: 'A non-foaming, detoxifying shave cream that forms a protective slick barrier for an ultra-close shave without razor burns or ingrown hairs.',
        usageGuide: {
          morning: 'Apply a thin layer to wet face. Shave with a clean razor. Rinse off with cool water.',
          night: ''
        },
        ratings: { average: 4.6, count: 11 },
        featured: false,
        bestSeller: false,
        newArrival: true,
        seoTitle: 'Charcoal & Clay Smoothing Shave Cream | Velora Grooming',
        seoDescription: 'Achieve a premium close shave. Velora Charcoal & Kaolin Clay Shave Cream prevents razor burns and detoxifies pores.'
      },
      {
        title: 'Sleep & Skin Recovery Melatonin Drops',
        slug: 'sleep-skin-recovery-night-drops',
        category: 'Wellness',
        concern: ['Dry Skin', 'Anti Aging'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 999,
        salePrice: 799,
        stock: 30,
        images: [
          '/images/melatonin_drops.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Supports deep, restful sleep cycle regulation',
          'Accelerates nighttime skin cell repair and collagen renewal',
          'Reduces morning skin puffiness and stress lines'
        ],
        ingredients: [
          { name: 'Pure Melatonin', percentage: '3mg', purpose: 'Restores natural sleep-wake cycles' },
          { name: 'Chamomile Extract', percentage: '50mg', purpose: 'Calms mind and relaxes facial muscles' }
        ],
        description: 'A fast-acting nighttime liquid supplement that combines Melatonin and Chamomile to calm the nervous system, helping you achieve deep sleep while accelerating cellular renewal.',
        usageGuide: {
          morning: '',
          night: 'Take 4-5 drops directly under the tongue 30 minutes before bed, or mix into a glass of warm water/tea.'
        },
        ratings: { average: 4.9, count: 22 },
        featured: true,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'Sleep & Skin Recovery Melatonin Drops | Velora',
        seoDescription: 'Sleep deep, wake up glowing. Velora Liquid Melatonin + Chamomile drops support restful sleep and cellular skin repair.'
      },
      {
        title: 'Daily Multivitamin & Skin Glow Capsules',
        slug: 'daily-multivitamin-immunity-capsule',
        category: 'Wellness',
        concern: ['Dry Skin', 'Anti Aging'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 1199,
        salePrice: 949,
        stock: 50,
        images: [
          '/images/daily_multivitamin.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Neutralizes systemic free radicals that age skin cells',
          'Enhances natural skin glow and evens pigmentation from within',
          'Boosts daily energy levels and immune defense routines'
        ],
        ingredients: [
          { name: 'Vitamin A, C, E Complex', percentage: '100% RDA', purpose: 'Antioxidant skin protection' },
          { name: 'L-Glutathione (Reduced)', percentage: '250mg', purpose: 'Fades hyperpigmentation and brightens skin tone' }
        ],
        description: 'An all-in-one daily wellness supplement packed with essential antioxidants, vitamins, and L-Glutathione to promote a radiant skin complexion and support physical vitality.',
        usageGuide: {
          morning: 'Take 1 capsule daily with breakfast and water.',
          night: ''
        },
        ratings: { average: 4.7, count: 35 },
        featured: false,
        bestSeller: false,
        newArrival: true,
        seoTitle: 'Daily Multivitamin & Skin Glow Glutathione Capsules | Velora',
        seoDescription: 'Brighten skin and boost vitality. Velora daily capsules combine L-Glutathione with Vitamins A, C, E.'
      },
      {
        title: 'Squalane & Rosehip Lip Conditioning Balm',
        slug: 'squalane-rosehip-lip-balm',
        category: 'Beauty Essentials',
        concern: ['Dry Skin'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 499,
        salePrice: 399,
        stock: 60,
        images: [
          '/images/squalane_lip_balm.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Locks in lip moisture for up to 12 hours',
          'Fades dark lip pigmentation and heals dry cracks',
          'Imparts a natural, non-sticky glossy finish'
        ],
        ingredients: [
          { name: 'Plant-derived Squalane', percentage: '5%', purpose: 'Locks in deep moisture' },
          { name: 'Rosehip Seed Oil', percentage: '10%', purpose: 'Rich in fatty acids to heal cracks and fade pigmentation' }
        ],
        description: 'A nourishing overnight and daytime lip conditioner that deeply hydrates dry lips, repairs cracks, and adds a soft, natural gloss.',
        usageGuide: {
          morning: 'Apply a thin layer as a base before lipsticks, or wear alone for a clean gloss.',
          night: 'Slather a generous layer before bed as an overnight hydrating lip mask.'
        },
        ratings: { average: 4.8, count: 48 },
        featured: false,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'Squalane & Rosehip Lip Balm | Velora Beauty Essentials',
        seoDescription: 'Hydrate dry, chapped lips. Velora Lip Conditioning Balm with 5% Squalane and Rosehip Oil heals cracks and fades dark tone.'
      },
      {
        title: 'Zinc & Aloe Hydrating Matte SPF 50',
        slug: 'zinc-aloe-vera-matte-spf50',
        category: 'Beauty Essentials',
        concern: ['Acne', 'Oily Skin', 'Pigmentation'],
        skinType: ['Oily', 'Combination', 'Sensitive', 'All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 899,
        salePrice: 749,
        stock: 45,
        images: [
          '/images/zinc_spf50.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Provides broad-spectrum SPF 50 UVA/UVB mineral protection',
          'Ultralight matte texture leaves zero white cast',
          'Aloe Vera cools sun-exposed skin and prevents irritation'
        ],
        ingredients: [
          { name: 'Zinc Oxide (Non-Nano)', percentage: '20%', purpose: 'Safe physical UV ray filter' },
          { name: 'Aloe Vera Juice', percentage: '10%', purpose: 'Hydrates and calms skin inflammation' }
        ],
        description: 'A clean, lightweight mineral sunscreen with SPF 50 protection. Dries down to a comfortable, non-greasy matte finish while keeping sensitive skin calm and hydrated.',
        usageGuide: {
          morning: 'Apply generously to face and neck 15 minutes before sun exposure. Reapply every 2 hours if swimming or sweating.',
          night: ''
        },
        ratings: { average: 4.9, count: 54 },
        featured: true,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'Zinc & Aloe Matte SPF 50 Mineral Sunscreen | Velora',
        seoDescription: 'Protect skin with Velora SPF 50 mineral sunscreen. Zinc Oxide + Aloe Vera formula leaves zero white cast.'
      },
      {
        title: 'Ginger & Scalp Stimulating Growth Oil',
        slug: 'ginger-scalp-stimulating-growth-oil',
        category: 'Hair Care',
        concern: ['Hair Fall', 'Dandruff'],
        skinType: ['All'],
        hairType: ['All'],
        gender: 'Unisex',
        price: 899,
        salePrice: 699,
        stock: 30,
        images: [
          '/images/ginger_growth_oil.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Stimulates blood circulation in the scalp to fuel hair growth',
          'Castor oil thickens hair strands and seals moisture',
          'Soothes scalp irritation and dry dandruff flaking'
        ],
        ingredients: [
          { name: 'Ginger Root Extract', percentage: '2%', purpose: 'Warms scalp and stimulates hair follicles' },
          { name: 'Castor Oil', percentage: '5%', purpose: 'Locks in scalp moisture and promotes root health' }
        ],
        description: 'A botanical active hair growth oil containing Ginger root extract and Castor oil to wake up tired hair follicles, thickening thin hair and repairing scalp dehydration.',
        usageGuide: {
          morning: '',
          night: 'Apply 3-4 drops directly to the scalp sections. Massage gently and leave overnight. Wash with Velora Biotin Shampoo.'
        },
        ratings: { average: 4.8, count: 20 },
        featured: true,
        bestSeller: false,
        newArrival: true,
        seoTitle: 'Ginger & Castor Oil Scalp Stimulating Growth Oil | Velora',
        seoDescription: 'Thicken thin hair and boost scalp health. Shop Velora Ginger & Castor Oil active scalp growth treatment.'
      },
      {
        title: 'Hyaluronic After Shave Calming Balm',
        slug: 'hyaluronic-after-shave-calming-balm',
        category: 'Grooming',
        concern: ['Daily Grooming', 'Dry Skin'],
        skinType: ['Dry', 'Combination', 'Sensitive', 'All'],
        hairType: ['All'],
        gender: 'Men',
        price: 799,
        salePrice: 649,
        stock: 35,
        images: [
          '/images/after_shave_balm.webp'
        ],
        beforeAfterImages: [],
        videoUrl: '',
        benefits: [
          'Instantly calms post-shave redness and razor burns',
          'Hyaluronic Acid locks in deep epidermal hydration',
          'Centella Asiatica (Cica) speeds up recovery of micro-cuts'
        ],
        ingredients: [
          { name: 'Hyaluronic Acid', percentage: '1%', purpose: 'Locks in post-shave dermal moisture' },
          { name: 'Centella Asiatica (Cica)', percentage: '2%', purpose: 'Accelerates skin barrier repair and heals razor cuts' }
        ],
        description: 'A cooling, fast-absorbing aftershave balm enriched with Hyaluronic acid and Cica to soothe shaved skin, hydrate dry layers, and rebuild the outer skin barrier.',
        usageGuide: {
          morning: 'Massage onto clean shaved face and neck until fully absorbed.',
          night: ''
        },
        ratings: { average: 4.9, count: 18 },
        featured: false,
        bestSeller: true,
        newArrival: true,
        seoTitle: 'Hyaluronic & Cica After Shave Calming Balm | Velora Men',
        seoDescription: 'Soothe razor burn and hydrate skin. Velora Hyaluronic & Cica post-shave balm cools redness and repairs the dermal barrier.'
      }
    ]);

    console.log('Products seeded. Seeding CMS Page Configurations...');

    // Home Page CMS
    const homePage = await CMSPage.create({
      pageKey: 'home',
      title: 'Velora | Premium Science-Backed Self-Care',
      seoTitle: 'Velora | Premium Science-Backed Self-Care',
      seoDescription: 'Dermatological science meets sensory luxury. Discover high-efficacy skincare, haircare, and grooming essentials for men and women.'
    });

    console.log('Seeding CMS Sections for Homepage...');

    await CMSSection.create([
      {
        pageKey: 'home',
        sectionKey: 'hero',
        order: 1,
        content: {
          headline: 'Clinical formulations. Elevated rituals.',
          subheadline: 'Velora blends high-potency, dermatologist-approved actives with premium sensory aesthetics. Self-care simplified for the modern lifestyle.',
          ctaText: 'Take Self-Care Quiz',
          backgroundImage: '/images/hero_premium.webp',
          secondaryCtaText: 'Explore Catalog'
        }
      },
      {
        pageKey: 'home',
        sectionKey: 'spotlight',
        order: 6,
        content: {
          title: 'Ingredient Spotlight',
          subtitle: 'Active science. Pure transparency.',
          ingredients: [
            { name: 'Niacinamide (10%)', desc: 'Regulates oil, minimizes pores, repairs barrier.', highlight: 'Blemish control' },
            { name: 'Hyaluronic Acid (2%)', desc: 'Attracts 1000x its weight in moisture to plump cells.', highlight: 'Deep hydration' },
            { name: 'Encapsulated Retinol (1%)', desc: 'Fades fine lines and stimulates structural collagen.', highlight: 'Anti-aging' },
            { name: 'Biotin (3%)', desc: 'Vitamin B7 that fortifies follicles to prevent hair fall.', highlight: 'Hair strength' }
          ]
        }
      },
      {
        pageKey: 'home',
        sectionKey: 'testimonials',
        order: 7,
        content: {
          title: 'Real Journeys, Verifiable Results',
          reviews: [
            { name: 'Dr. Neha Sharma', role: 'Consulting Dermatologist', quote: 'Velora formulations bridge the gap between clinical efficacy and aesthetic excellence. I recommend their BHA serum for acne-prone skin.' },
            { name: 'Rohan Malhotra', role: 'Verified Purchase', quote: 'The Biotin shampoo and Beard Elixir transformed my morning routine. Within 3 weeks, my beard was softer and scalp flaking stopped completely.' },
            { name: 'Ananya Sen', role: 'Verified Purchase', quote: 'The 15% Vitamin C serum is incredible. It is the first active serum that actually faded my acne scars without giving me redness.' }
          ]
        }
      },
      {
        pageKey: 'home',
        sectionKey: 'faq',
        order: 9,
        content: {
          title: 'Frequently Answered Questions',
          faqs: [
            { q: 'Are your products dermatologist tested?', a: 'Yes. All Velora formulations undergo rigorous independent clinical evaluation and are approved by certified dermatologists.' },
            { q: 'How does the Self-Care Assessment work?', a: 'Our assessment evaluates your gender, skin type, hair type, and primary concerns (e.g. acne, hair fall) to recommend an exact morning/night routine matching your biology.' },
            { q: 'Do you offer clean formulations?', a: 'Yes. We are 100% cruelty-free, paraben-free, sulfate-free, and formulate without synthetic fragrances or colors.' }
          ]
        }
      }
    ]);

    // Seeding sample reviews for product 0 (Vitamin C)
    console.log('Seeding reviews...');
    await Review.create([
      {
        user: users[1]._id,
        userName: users[1].name,
        product: products[0]._id,
        rating: 5,
        comment: 'Absolutely love this Vitamin C serum! My acne scars faded significantly in 3 weeks. It feels very premium and non-sticky.',
        verifiedPurchase: true
      },
      {
        user: users[0]._id,
        userName: users[0].name,
        product: products[0]._id,
        rating: 4,
        comment: 'Highly stable serum. Make sure to wear sunscreen during the day when using it. Definitely worth the price.',
        verifiedPurchase: true
      }
    ]);

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
