export const siteConfig = {
  name: "AI Humanizer",
  url: import.meta.env.VITE_SITE_URL || window.location.origin,
  ogImage: "https://ai-humanizer-gold.vercel.app/og.jpg",
  description: "Transform AI-generated text into natural, human-like content.",
  links: {
    github: "https://github.com/rohan-darji/ai-humanizer",
  },
} as const;

export type SiteConfig = typeof siteConfig; 