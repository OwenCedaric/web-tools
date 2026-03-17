const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const toolsDir = path.join(baseDir, 'tools');
const toolsJsonPath = path.join(baseDir, 'tools.json');
const generatedToolsPath = path.join(baseDir, 'generated-tools.json');
const sitemapPath = path.join(baseDir, 'sitemap.xml');

// Base URL for sitemap
const baseUrl = 'https://tools.ceda.is';

// 1. Read external tools from tools.json
let externalTools = [];
try {
    if (fs.existsSync(toolsJsonPath)) {
        const toolsJsonContent = fs.readFileSync(toolsJsonPath, 'utf-8');
        externalTools = JSON.parse(toolsJsonContent);
        console.log(`Successfully read ${externalTools.length} external tools from tools.json.`);
    }
} catch (err) {
    console.error('Error reading tools.json:', err);
}

// 2. Scan local HTML files in tools/ directory
const localTools = [];
if (fs.existsSync(toolsDir)) {
    const files = fs.readdirSync(toolsDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    htmlFiles.forEach(file => {
        const filePath = path.join(toolsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract metadata using regex
        const titleMatch = content.match(/<title>([^<]*?) - Web Tools<\/title>/) || content.match(/<title>([^<]*?)<\/title>/);
        const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*?)"/);
        const iconMatch = content.match(/<meta\s+name="tool-icon"\s+content="([^"]*?)"/);
        const tagsMatch = content.match(/<meta\s+name="tool-tags"\s+content="([^"]*?)"/);

        const title = titleMatch ? titleMatch[1].trim() : file.replace('.html', '');
        const description = descMatch ? descMatch[1].trim() : '';
        const icon = iconMatch ? iconMatch[1].trim() : 'ri-tools-line';
        const tagsStr = tagsMatch ? tagsMatch[1].trim() : '';
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

        localTools.push({
            title,
            description,
            icon,
            url: `/tools/${file}`,
            tags
        });
    });
    console.log(`Successfully scanned ${localTools.length} local tools from tools/ directory.`);
}

// 3. Combine and save
const allTools = [...externalTools, ...localTools];
fs.writeFileSync(generatedToolsPath, JSON.stringify(allTools, null, 2), 'utf-8');
console.log(`Successfully generated generated-tools.json with ${allTools.length} tools.`);

// 4. Generate sitemap.xml
const sitemapUrls = [{ loc: `${baseUrl}/`, priority: '1.0' }];

allTools.forEach(tool => {
    // Only add local tools to sitemap
    if (tool.url && tool.url.startsWith('/')) {
        sitemapUrls.push({
            loc: `${baseUrl}${tool.url}`,
            priority: '0.8'
        });
    }
});

const today = new Date().toISOString().split('T')[0];
let sitemapXmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemapUrls.forEach(u => {
    sitemapXmlContent += `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>\n`;
});
sitemapXmlContent += `</urlset>`;

fs.writeFileSync(sitemapPath, sitemapXmlContent, 'utf-8');
console.log(`Successfully generated sitemap.xml with ${sitemapUrls.length} entries.`);
