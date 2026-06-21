import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  mergeWishlist,
  getAllUsers
} from '../controllers/authController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/toggle', protect, toggleWishlist);
router.post('/wishlist/merge', protect, mergeWishlist);
router.get('/admin/users', protect, admin, getAllUsers);

export default router;
