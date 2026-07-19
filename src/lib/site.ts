import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const siteConfig = {
  name: "മുഈനുദ്ദീൻ ബാഖവി പി",
  scholarName: "Mueenuddeen Baqavi P",
  domain: "mueenudeenbaqavi.com",
  url: "https://mueenudeenbaqavi.com",
  locale: "ml_IN",
  description:
    "മുഈനുദ്ദീൻ ബാഖവി പിയുടെ ജീവചരിത്രം, ലേഖനങ്ങൾ, ഫത്വകൾ, പുസ്തകങ്ങൾ, ക്ലാസുകൾ, കോഴ്സുകൾ, അഹ്‌ലുസ്സുന്ന ഉള്ളടക്കങ്ങൾ എന്നിവയ്ക്കായുള്ള ഔദ്യോഗിക വിജ്ഞാന പ്ലാറ്റ്ഫോം.",
  whatsapp: "919496343397",
  phone: "9496343397",
  email: "mueenbaqavi@gmail.com",
  address: "പുൽപ്പറമ്പൻ ഹൗസ്, പി.ഒ. വിളയിൽ, കുഴിമണ്ണ, മലപ്പുറം - 673641",
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  type = "website",
  image = "/api/og",
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [absoluteUrl(image)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.scholarName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  birthDate: "1977-05",
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: siteConfig.address,
  jobTitle: "Islamic Scholar",
  knowsAbout: ["Islamic jurisprudence", "Ahlu Sunnah", "Malayalam Islamic education"],
};
