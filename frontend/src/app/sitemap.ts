import type { MetadataRoute } from "next";

import { getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const staticRoutes = ["", "/projects", "/experience", "/about", "/resume", "/notes", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = getAllProjects().map((project) => `/projects/${project.slug}`);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
