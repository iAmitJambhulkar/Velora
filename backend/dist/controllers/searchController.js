"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAll = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// Mock Blog Posts for simple search matching
const MOCK_BLOGS = [
    {
        title: 'The Ultimate Skincare Guide for Sensitive Skin',
        slug: 'skincare-guide-sensitive-skin',
        excerpt: 'Understand the triggers of dry and sensitive skin, and how Niacinamide can restore your barrier.',
        category: 'Skincare',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60'
    },
    {
        title: 'Why Hyaluronic Acid is Crucial for Winter Hydration',
        slug: 'hyaluronic-acid-winter-hydration',
        excerpt: 'Hyaluronic acid holds 1000x its weight in water. Here is why your dry skin needs it now.',
        category: 'Science',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=60'
    },
    {
        title: 'How to Prevent Hair Fall: A Biotin-Based Routine',
        slug: 'prevent-hair-fall-biotin',
        excerpt: 'Say goodbye to dandruff and thinning. Learn how Keratin and Biotin fortify roots.',
        category: 'Haircare',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60'
    },
    {
        title: 'Beard Grooming: From Stubble to Sculpted Majesty',
        slug: 'beard-grooming-stubble-to-sculpted',
        excerpt: 'Discover why premium cedarwood beard oils stimulate growth and banish beard dandruff.',
        category: 'Grooming',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&auto=format&fit=crop&q=60'
    }
];
// Mock Ingredients Library for lookup
const MOCK_INGREDIENTS = [
    {
        name: 'Niacinamide',
        purpose: 'Regulates oil production, calms redness, and repairs skin barrier.',
        percentage: '10%',
        type: 'Vitamin B3 Derivative'
    },
    {
        name: 'Hyaluronic Acid',
        purpose: 'Deeply hydrates dry skin cells and binds moisture.',
        percentage: '2%',
        type: 'Humectant'
    },
    {
        name: 'Retinol',
        purpose: 'Accelerates skin cell turnover, reduces fine lines and wrinkles.',
        percentage: '1%',
        type: 'Vitamin A Derivative'
    },
    {
        name: 'Salicylic Acid',
        purpose: 'Penetrates deep into pores to dissolve acne-causing debris.',
        percentage: '2%',
        type: 'Beta Hydroxy Acid (BHA)'
    },
    {
        name: 'Biotin',
        purpose: 'Strengthens keratin structure to stop hair fall and stimulate growth.',
        percentage: '3%',
        type: 'Vitamin B7'
    },
    {
        name: 'Keratin',
        purpose: 'Smooths frizz, rebuilds hair strands, and restores cuticle shine.',
        percentage: '5%',
        type: 'Protein Structurer'
    }
];
const searchAll = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.json({
                success: true,
                data: {
                    products: [],
                    ingredients: [],
                    blogs: []
                }
            });
        }
        // 1. Search products in DB
        const products = await Product_1.default.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { concern: { $in: [new RegExp(q, 'i')] } },
                { description: { $regex: q, $options: 'i' } }
            ]
        }).limit(6);
        // 2. Search ingredients matching query
        const ingredients = MOCK_INGREDIENTS.filter(ing => ing.name.toLowerCase().includes(q.toLowerCase()) ||
            ing.purpose.toLowerCase().includes(q.toLowerCase()));
        // 3. Search blogs matching query
        const blogs = MOCK_BLOGS.filter(blog => blog.title.toLowerCase().includes(q.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(q.toLowerCase()) ||
            blog.category.toLowerCase().includes(q.toLowerCase()));
        res.json({
            success: true,
            data: {
                products,
                ingredients,
                blogs
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.searchAll = searchAll;
