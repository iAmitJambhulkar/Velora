import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'velora_jwt_secret_token_key_987654321', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password, guestWishlist } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Merge wishlist if guestWishlist is provided
    if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
      const mergedWishlist = Array.from(new Set([
        ...user.wishlist.map((id: any) => id.toString()),
        ...guestWishlist.filter((id: string) => id.match(/^[0-9a-fA-F]{24}$/))
      ]));
      user.wishlist = mergedWishlist;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id.toString())
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({ street, city, state, zipCode, country, isDefault });
    await user.save();

    res.json({ success: true, data: user.addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  const { addressId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
    await user.save();

    res.json({ success: true, data: user.addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const index = user.wishlist.indexOf(productId);
    if (index >= 0) {
      user.wishlist.splice(index, 1); // remove
    } else {
      user.wishlist.push(productId); // add
    }

    await user.save();
    res.json({ success: true, data: user.wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const mergeWishlist = async (req: AuthRequest, res: Response) => {
  const { wishlist } = req.body; // array of product IDs

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (Array.isArray(wishlist)) {
      const merged = Array.from(new Set([
        ...user.wishlist.map((id: any) => id.toString()),
        ...wishlist.filter((id: string) => id.match(/^[0-9a-fA-F]{24}$/))
      ]));
      user.wishlist = merged;
      await user.save();
    }

    res.json({ success: true, data: user.wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin route
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
