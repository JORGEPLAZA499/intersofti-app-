import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.rpjsoftware.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/eSIM", changefreq: "weekly", priority: "0.9" },
  { path: "/box_ai", changefreq: "weekly", priority: "0.9" },
  { path: "/box_ai/solutions", changefreq: "monthly", priority: "0.7" },
  { path: "/ghostcode-s10", changefreq: "monthly", priority: "0.7" },
  { path: "/ghostcode-s10/messenger", changefreq: "monthly", priority: "0.6" },
  { path: "/ghostcode-s10/token", changefreq: "monthly", priority: "0.6" },
  { path: "/ghostcode-s10-product", changefreq: "monthly", priority: "0.7" },
  { path: "/crypto-card-firswe-visa", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/activation", changefreq: "monthly", priority: "0.6" },
  { path: "/esim-status", changefreq: "monthly", priority: "0.7" },
  { path: "/order-tracking", changefreq: "monthly", priority: "0.6" },
  { path: "/help", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.5" },
  { path: "/terms", changefreq: "yearly", priority: "0.5" },
  { path: "/checkout/return", changefreq: "yearly", priority: "0.3" },
  { path: "/unsubscribe", changefreq: "yearly", priority: "0.3" },
  { path: "/blog/1", changefreq: "monthly", priority: "0.6" },
  { path: "/blog/2", changefreq: "monthly", priority: "0.6" },
  { path: "/blog/3", changefreq: "monthly", priority: "0.6" },
  { path: "/blog/4", changefreq: "monthly", priority: "0.6" },
  { path: "/blog/best-travel-esim-comparison", changefreq: "monthly", priority: "0.8" },
];

function generateSitemap(entries: SitemapEntry[]) {
  const today = new Date().toISOString().split("T")[0];
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${e.lastmod || today}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
