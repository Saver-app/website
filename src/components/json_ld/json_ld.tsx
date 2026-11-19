interface JsonLdProps {
  data: Record<string, unknown>;
}

/*
  Structured data for search engines. "<" is written as an escape so that no
  value can end the script element early.
*/
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
