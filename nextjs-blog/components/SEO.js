import Head from 'next/head';

export default function SEO({ title, description, ogImage, url }) {
  const siteTitle = 'My Blog';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'A NextJS blog with interesting articles';
  const defaultOgImage = '/images/og-default.jpg';
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
    </Head>
  );
}