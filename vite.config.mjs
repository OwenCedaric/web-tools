import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import fs from 'fs';

const toolsDir = resolve(__dirname, 'tools');
const toolFiles = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));

const inputs = {
  main: resolve(__dirname, 'index.html'),
};

toolFiles.forEach(file => {
  const name = file.replace('.html', '');
  inputs[name] = resolve(toolsDir, file);
});

// Plugin to generate tool metadata and sitemap
function toolMetadataPlugin() {
  let allToolsData = null;
  let sitemapContent = null;

  const generateData = () => {
    const config = JSON.parse(fs.readFileSync(resolve(__dirname, 'config.json'), 'utf-8'));
    const baseUrl = config.baseUrl || 'https://tools.ceda.is';
    
    let externalTools = [];
    const toolsJsonPath = resolve(__dirname, 'tools.json');
    if (fs.existsSync(toolsJsonPath)) {
      externalTools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf-8'));
    }

    const localTools = [];
    toolFiles.forEach(file => {
      const filePath = resolve(toolsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const titleMatch = content.match(/<title>([^<]*?) - (?:Web Tools|\{\{siteName\}\})<\/title>/) || content.match(/<title>([^<]*?)<\/title>/);
      const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*?)"/);
      const iconMatch = content.match(/<meta\s+name="tool-icon"\s+content="([^"]*?)"/);
      const tagsMatch = content.match(/<meta\s+name="tool-tags"\s+content="([^"]*?)"/);

      localTools.push({
        title: titleMatch ? titleMatch[1].trim() : file.replace('.html', ''),
        description: descMatch ? descMatch[1].trim() : '',
        icon: iconMatch ? iconMatch[1].trim() : 'ri-tools-line',
        url: `/tools/${file}`,
        tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : []
      });
    });

    const allTools = [...externalTools, ...localTools];
    allToolsData = JSON.stringify(allTools, null, 2);

    const today = new Date().toISOString().split('T')[0];
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemap += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
    allTools.forEach(tool => {
      const url = tool.url.startsWith('/') ? `${baseUrl}${tool.url}` : tool.url;
      sitemap += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    sitemap += `</urlset>`;
    sitemapContent = sitemap;
  };

  return {
    name: 'tool-metadata',
    buildStart() {
      generateData();
    },
    configureServer(server) {
      // Serve virtual files in dev mode
      server.middlewares.use((req, res, next) => {
        if (req.url === '/generated-tools.json') {
          generateData();
          res.setHeader('Content-Type', 'application/json');
          res.end(allToolsData);
          return;
        }
        if (req.url === '/sitemap.xml') {
          generateData();
          res.setHeader('Content-Type', 'application/xml');
          res.end(sitemapContent);
          return;
        }
        next();
      });
    },
    closeBundle() {
      const distPath = resolve(__dirname, 'dist');
      if (fs.existsSync(distPath)) {
        fs.writeFileSync(resolve(distPath, 'generated-tools.json'), allToolsData);
        fs.writeFileSync(resolve(distPath, 'sitemap.xml'), sitemapContent);
        console.log('Build: generated-tools.json and sitemap.xml emitted to dist.');
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    toolMetadataPlugin(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        const config = JSON.parse(fs.readFileSync(resolve(__dirname, 'config.json'), 'utf-8'));
        const footer = fs.readFileSync(resolve(__dirname, 'src/footer.html'), 'utf-8');
        let transformed = html.replace('<!-- INJECT_FOOTER -->', footer);
        for (const [key, value] of Object.entries(config)) {
          if (typeof value === 'string') {
            transformed = transformed.replace(new RegExp(`{{${key}}}`, 'g'), value);
          }
        }
        return transformed;
      }
    }
  ],
  build: {
    rollupOptions: {
      input: inputs,
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split out particularly large libraries to their own chunks for better caching
            if (id.includes('marked')) {
              return 'vendor-marked';
            }
            if (id.includes('html2pdf.js') || id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('html-to-image')) {
              return 'vendor-image';
            }
            // Group other smaller dependencies together
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    emptyOutDir: true,
  }
});
