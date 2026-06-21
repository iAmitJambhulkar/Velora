import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/quiz`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/ingredients`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  try {
    // 1. Fetch Dynamic Product Slugs
    const productsRes = await fetch(`${API_URL}/products?limit=100`, {
      next: { revalidate: 3600 } // Cache results for 1 hour
    });
    const productsData = await productsRes.json();
    const productRoutes = (productsData.data || []).map((p: any) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: new Date(p.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // For local blog page, we can also query articles
    // Currently, blogs are local static definitions, but we define their sitemaps:
    const blogSlugs = [
      'skincare-guide-sensitive-skin',
      'hyaluronic-acid-winter-hydration',
      'prevent-hair-fall-biotin'
    ];
    const blogRoutes = blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Dynamic sitemap generation failed, falling back to static routes:', error);
    return staticRoutes;
  }
}
