import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Inject a `<link rel="preload">` for the LCP image (header logo) directly
 * into the built index.html so the browser starts downloading it during
 * HTML parsing — before any JS executes. This eliminates the "resource
 * load delay" subpart of LCP.
 */
function preloadLcpImage(): Plugin {
  let logoHref: string | null = null;
  return {
    name: "preload-lcp-image",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (/assets\/logo-header.*\.avif$/.test(fileName)) {
          logoHref = `/${fileName}`;
          break;
        }
      }
    },
    transformIndexHtml(html) {
      if (!logoHref) return html;
      const tag = `<link rel="preload" as="image" type="image/avif" fetchpriority="high" href="${logoHref}">`;
      return html.replace("</head>", `    ${tag}\n  </head>`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    preloadLcpImage(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query"],
  },
}));
