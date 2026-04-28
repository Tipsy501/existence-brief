import { supabase } from './supabase';

/**
 * Generates a dynamic sitemap.xml structure
 */
export async function generateSitemapContent() {
  const baseUrl = 'https://existencebrief.com';
  
  const staticPages = [
    '',
    '/how-it-works',
    '/pricing',
    '/login',
    '/signup'
  ];

  // Fetch dynamic content
  const { data: publicBriefs } = await supabase
    .from('briefs')
    .select('id')
    .eq('is_public', true);

  const topics = ['career-change', 'start-business', 'find-purpose', 'financial-freedom'];

  const urls = [
    ...staticPages.map(page => `${baseUrl}${page}`),
    ...(publicBriefs || []).map(b => `${baseUrl}/p/${b.id}`),
    ...topics.map(t => `${baseUrl}/topics/${t}`)
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${url.split('/').length > 4 ? '0.6' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;

  return sitemap;
}
