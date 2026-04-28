import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";

// Load environment variables
dotenv.config();

import { generateSitemapContent } from "./src/lib/sitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for dev environment compatibility if needed, or configure carefully
    crossOriginEmbedderPolicy: false,
    frameguard: {
      action: 'sameorigin'
    }
  }));

  // Sitemap route
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const content = await generateSitemapContent();
      res.header('Content-Type', 'application/xml');
      res.send(content);
    } catch (error) {
      console.error('Sitemap error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // API routes could go here

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
