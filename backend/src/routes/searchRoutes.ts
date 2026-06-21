import express from 'express';
import { searchAll } from '../controllers/searchController';

const router = express.Router();

router.get('/', searchAll);

export default router;
