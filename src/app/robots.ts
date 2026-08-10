import type { MetadataRoute } from "next";

// EDIT: keep in sync with SITE_URL in layout.tsx.
const SITE_URL = "https://naman-gupta.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
