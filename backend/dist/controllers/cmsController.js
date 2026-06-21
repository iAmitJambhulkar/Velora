"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCMSPages = exports.updateSectionContent = exports.getPageContent = void 0;
const CMSPage_1 = __importDefault(require("../models/CMSPage"));
const CMSSection_1 = __importDefault(require("../models/CMSSection"));
// Get all sections for a page
const getPageContent = async (req, res) => {
    const { pageKey } = req.params;
    try {
        const page = await CMSPage_1.default.findOne({ pageKey: pageKey.toLowerCase() });
        const sections = await CMSSection_1.default.find({ pageKey: pageKey.toLowerCase() }).sort({ order: 1 });
        res.json({
            success: true,
            data: {
                page,
                sections: sections.reduce((acc, sec) => {
                    acc[sec.sectionKey] = sec.content;
                    return acc;
                }, {})
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPageContent = getPageContent;
// Create or update section content
const updateSectionContent = async (req, res) => {
    const { pageKey, sectionKey } = req.params;
    const { content, order } = req.body;
    try {
        // Upsert the page definition
        let page = await CMSPage_1.default.findOne({ pageKey: pageKey.toLowerCase() });
        if (!page) {
            page = await CMSPage_1.default.create({
                pageKey: pageKey.toLowerCase(),
                title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1) + ' Page'
            });
        }
        // Upsert the section
        const section = await CMSSection_1.default.findOneAndUpdate({ pageKey: pageKey.toLowerCase(), sectionKey: sectionKey.toLowerCase() }, {
            content,
            order: order !== undefined ? Number(order) : 0,
            updatedAt: new Date()
        }, { new: true, upsert: true });
        res.json({ success: true, data: section });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateSectionContent = updateSectionContent;
// Admin list of pages
const getCMSPages = async (req, res) => {
    try {
        const pages = await CMSPage_1.default.find({}).sort({ pageKey: 1 });
        res.json({ success: true, data: pages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCMSPages = getCMSPages;
