import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  schema?: object | object[];
}

const DEFAULT_TITLE = "Di-Aza Studio | Luxury Interior Design Studio in Bangalore";
const DEFAULT_DESCRIPTION = "Di-Aza Studio is a premier interior design studio in Bangalore specializing in luxury home, villa, and apartment interiors. Explore our portfolio, methodology, and customized aesthetic spaces.";
const DEFAULT_SITE_URL = "https://diazastudio.com";
const DEFAULT_IMAGE = "https://res.cloudinary.com/nw9o0vrv/image/upload/f_auto,q_auto,w_1200/diaza_studio/drive_images/Tusar_diaza/DSC04885-HDR";

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = "website",
  image = DEFAULT_IMAGE,
  schema,
}: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title.includes("Di-Aza") ? title : `${title} | Di-Aza Studio`;

    // Helper to set or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to set link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    const currentUrl = canonical || (typeof window !== "undefined" ? window.location.href : DEFAULT_SITE_URL);

    // Standard Meta
    setMetaTag('meta[name="description"]', "name", "description", description);
    setMetaTag('meta[name="author"]', "name", "author", "Di-Aza Studio");
    setMetaTag('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Canonical
    setLinkTag("canonical", currentUrl);

    // OpenGraph
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:type"]', "property", "og:type", type);
    setMetaTag('meta[property="og:url"]', "property", "og:url", currentUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", image);
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "Di-Aza Studio");
    setMetaTag('meta[property="og:locale"]', "property", "og:locale", "en_US");

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);

    // Structured Data (JSON-LD)
    const schemaId = "seo-jsonld-schema";
    let scriptElement = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = schemaId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }

    const defaultSchemas = [
      {
        "@context": "https://schema.org",
        "@type": "InteriorDesignStudio",
        "@id": `${DEFAULT_SITE_URL}/#organization`,
        "name": "Di-Aza Studio",
        "url": DEFAULT_SITE_URL,
        "logo": "https://res.cloudinary.com/nw9o0vrv/image/upload/f_auto,q_auto,w_400/diaza_studio/logo",
        "description": "Di-Aza Studio transforms spaces through innovative interior design excellence in Bangalore, offering bespoke villa and apartment interior solutions.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.instagram.com/diazastudio",
          "https://www.facebook.com/diazastudio",
          "https://www.linkedin.com/company/diazastudio"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${DEFAULT_SITE_URL}/#website`,
        "url": DEFAULT_SITE_URL,
        "name": "Di-Aza Studio",
        "publisher": {
          "@id": `${DEFAULT_SITE_URL}/#organization`
        }
      }
    ];

    const finalSchemas = schema 
      ? Array.isArray(schema) ? [...defaultSchemas, ...schema] : [...defaultSchemas, schema]
      : defaultSchemas;

    scriptElement.textContent = JSON.stringify(finalSchemas);
  }, [title, description, canonical, type, image, schema]);

  return null;
}
