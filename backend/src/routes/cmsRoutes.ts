import express from 'express';
import { getPageContent, updateSectionContent, getCMSPages } from '../controllers/cmsController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/:pageKey', getPageContent);

// Admin routes
router.get('/admin/pages', protect, admin, getCMSPages);
router.post('/:pageKey/:sectionKey', protect, admin, updateSectionContent);

export default router;
