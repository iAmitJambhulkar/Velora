import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      concern,
      skinType,
      hairType,
      gender,
      minPrice,
      maxPrice,
      rating,
      sort,
      featured,
      bestSeller,
      newArrival,
      search,
      limit = '50',
      page = '1'
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (concern) query.concern = { $in: Array.isArray(concern) ? concern : [concern] };
    if (skinType) query.skinType = { $in: Array.isArray(skinType) ? skinType : [skinType] };
    if (hairType) query.hairType = { $in: Array.isArray(hairType) ? hairType : [hairType] };
    if (gender) query.gender = gender;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) query['ratings.average'] = { $gte: Number(rating) };
    if (featured === 'true') query.featured = true;
    if (bestSeller === 'true') query.bestSeller = true;
    if (newArrival === 'true') query.newArrival = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions: any = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { 'ratings.average': -1 };
    else if (sort === 'popularity') sortOptions = { 'ratings.count': -1 };

    const itemsPerPage = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * itemsPerPage;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / itemsPerPage),
        limit: itemsPerPage
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin handlers
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    if (!product.slug && product.title) {
      product.slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
