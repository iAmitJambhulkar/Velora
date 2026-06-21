import { Request, Response } from 'express';
import CMSPage from '../models/CMSPage';
import CMSSection from '../models/CMSSection';

// Get all sections for a page
export const getPageContent = async (req: Request, res: Response) => {
  const { pageKey } = req.params;

  try {
    const page = await CMSPage.findOne({ pageKey: pageKey.toLowerCase() });
    const sections = await CMSSection.find({ pageKey: pageKey.toLowerCase() }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        page,
        sections: sections.reduce((acc: any, sec) => {
          acc[sec.sectionKey] = sec.content;
          return acc;
        }, {})
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update section content
export const updateSectionContent = async (req: Request, res: Response) => {
  const { pageKey, sectionKey } = req.params;
  const { content, order } = req.body;

  try {
    // Upsert the page definition
    let page = await CMSPage.findOne({ pageKey: pageKey.toLowerCase() });
    if (!page) {
      page = await CMSPage.create({
        pageKey: pageKey.toLowerCase(),
        title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1) + ' Page'
      });
    }

    // Upsert the section
    const section = await CMSSection.findOneAndUpdate(
      { pageKey: pageKey.toLowerCase(), sectionKey: sectionKey.toLowerCase() },
      {
        content,
        order: order !== undefined ? Number(order) : 0,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: section });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin list of pages
export const getCMSPages = async (req: Request, res: Response) => {
  try {
    const pages = await CMSPage.find({}).sort({ pageKey: 1 });
    res.json({ success: true, data: pages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
