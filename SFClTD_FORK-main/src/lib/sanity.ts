import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// You will get this Project ID when you create a free account at sanity.io
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your_project_id', // Replace with actual ID later
  dataset: 'production',
  useCdn: true, // true = fast, cached content
  apiVersion: '2023-05-03',
});

// Helper to convert Sanity image references to real URLs
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => {
  if (!source) return undefined;
  return builder.image(source).url();
};

// --- CENTRALIZED QUERIES ---
// This keeps your GROQ queries organized in one place
// ... keep imports and client setup ...

export const QUERIES = {
  // Homepage
  HOMEPAGE: `*[_type == "homepage"][0]{
    heroTitle,
    heroSubtitle,
    heroDescription,
    "heroImage": heroImage.asset->url,
    stats[] { label, value }
  }`,
  
  // Services & Products
  SERVICES: `*[_type == "service"] | order(order asc) {
    _id,
    title,
    subtitle,
    description,
    basePrice,
    iconKey, 
    features,
    badge,
    volumeDiscounts
  }`,

  // Specialists (for Collective Page)
  SPECIALISTS: `*[_type == "specialist"] | order(name asc) {
    _id,
    name,
    "avatar": avatar.asset->url,
    specialties,
    budgetRange,
    experience,
    strengths,
    "pros": prosAndCons.pros,
    "cons": prosAndCons.cons,
    services,
    rating,
    completedProjects
  }`,

  // Testimonials & Brands (for Results Page)
  RESULTS_PAGE: `*[_type == "resultsPage"][0]{
    title,
    subtitle,
    description,
    metrics[] { label, value, "iconKey": iconKey },
    testimonials[] {
      name,
      company,
      text,
      result,
      rating,
      "image": image.asset->url
    },
    brands[] {
      name,
      url,
      "logo": logo.asset->url
    }
  }`,

  // TikTok Page
  TIKTOK_PAGE: `*[_type == "tiktokPage"][0]{
    title,
    subtitle,
    description,
    "heroImage": heroImage.asset->url,
    features[] { title, description, "iconKey": iconKey },
    principles[] { title, description }
  }`,

  // Philosophy / Doughnut Economics
  PHILOSOPHY_PAGE: `*[_type == "philosophyPage"][0]{
    title,
    subtitle,
    description,
    principles[] { title, description, "iconKey": iconKey },
    values[] { title, description, "iconKey": iconKey }
  }`
};
