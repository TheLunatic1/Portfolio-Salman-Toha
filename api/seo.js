const PRIMARY_URL = 'https://toha.nratlabs.com';

function resolveBaseUrl(req) {
  const rawHost = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');

  if (rawHost === 'toha.nratlabs.com' || rawHost === 'www.toha.nratlabs.com') {
    return `https://${rawHost}`;
  }
  if (/^(?:salmantoha|portfolio-salman-toha)(?:-[a-z0-9-]+)?\.vercel\.app$/.test(rawHost)) {
    return `https://${rawHost}`;
  }
  return PRIMARY_URL;
}

function getKind(req) {
  if (req.query?.kind) return String(req.query.kind);
  const url = String(req.url || '');
  if (url.includes('kind=robots') || url.startsWith('/robots.txt')) return 'robots';
  if (url.includes('kind=sitemap') || url.startsWith('/sitemap.xml')) return 'sitemap';
  const qsIdx = url.indexOf('?');
  if (qsIdx !== -1) {
    const params = new URLSearchParams(url.slice(qsIdx + 1));
    return params.get('kind') || 'sitemap';
  }
  return 'sitemap';
}

export default function handler(req, res) {
  const baseUrl = resolveBaseUrl(req);
  const kind = getKind(req);

  res.statusCode = 200;
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Vary', 'Host, X-Forwarded-Host');

  if (kind === 'robots') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(
      [
        '# Robots.txt for Salman Toha Portfolio',
        '# Allows all search engines, AI crawlers, LLM agentic browsers, and WebMCP tools',
        '',
        'User-agent: *',
        'Allow: /',
        '',
        '# Dedicated AI Agent Directives',
        'User-agent: GPTBot',
        'Allow: /',
        '',
        'User-agent: ChatGPT-User',
        'Allow: /',
        '',
        'User-agent: ClaudeBot',
        'Allow: /',
        '',
        'User-agent: Google-Extended',
        'Allow: /',
        '',
        'User-agent: Googlebot',
        'Allow: /',
        '',
        'User-agent: PerplexityBot',
        'Allow: /',
        '',
        'User-agent: Applebot',
        'Allow: /',
        '',
        'User-agent: Applebot-Extended',
        'Allow: /',
        '',
        'User-agent: CCBot',
        'Allow: /',
        '',
        'User-agent: anthropic-ai',
        'Allow: /',
        '',
        'User-agent: cohere-ai',
        'Allow: /',
        '',
        'User-agent: Omgilibot',
        'Allow: /',
        '',
        '# Sitemaps & LLM Context Standards',
        `Sitemap: ${baseUrl}/sitemap.xml`,
        `LLMs-Txt: ${baseUrl}/llms.txt`,
        `LLMs-Full-Txt: ${baseUrl}/llms-full.txt`,
        '',
      ].join('\n')
    );
    return;
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.end(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url>',
      `    <loc>${baseUrl}/</loc>`,
      '    <lastmod>2026-11-18</lastmod>',
      '    <changefreq>weekly</changefreq>',
      '    <priority>1.0</priority>',
      '  </url>',
      '  <url>',
      `    <loc>${baseUrl}/llms.txt</loc>`,
      '    <lastmod>2026-11-18</lastmod>',
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '  <url>',
      `    <loc>${baseUrl}/llms-full.txt</loc>`,
      '    <lastmod>2026-11-18</lastmod>',
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '</urlset>',
      '',
    ].join('\n')
  );
}
