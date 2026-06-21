"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cmsController_1 = require("../controllers/cmsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/:pageKey', cmsController_1.getPageContent);
// Admin routes
router.get('/admin/pages', auth_1.protect, auth_1.admin, cmsController_1.getCMSPages);
router.post('/:pageKey/:sectionKey', auth_1.protect, auth_1.admin, cmsController_1.updateSectionContent);
exports.default = router;
