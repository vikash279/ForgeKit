/**
 * Server-rendered JSON-LD. Included in the initial HTML so crawlers can read
 * WebApplication and FAQPage schema without executing client JavaScript.
 */
export function JsonLd({ data }: { data: object }) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
