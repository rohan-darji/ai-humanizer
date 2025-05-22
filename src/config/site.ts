export const siteConfig = {
  name: "AI Humanizer",
  url: "https://ai-humanizer-gold.vercel.app",
  ogImage: "https://ai-humanizer-gold.vercel.app/og.jpg",
  description: "Transform AI-generated text into natural, human-like content.",
  links: {
    github: "https://github.com/rohan-darji/ai-humanizer",
  },
} as const;

export type SiteConfig = typeof siteConfig; 