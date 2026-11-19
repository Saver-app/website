import type { Metadata } from "next";

import { SITE_NAME, SITE_URL, X_HANDLE } from "@/constants";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

const SOCIAL_IMAGE = {
  url: `${SITE_URL}/ogpreview20260718.png`,
  width: 1200,
  height: 630,
  alt: "Saver",
} as const;

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [SOCIAL_IMAGE],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
  };
}
