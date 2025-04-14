import Head from 'next/head';
import ErrorBoundary from './ErrorBoundary';

export default function SEO({ 
  title, 
  description, 
  canonical, 
  ogType = 'website',
  ogImage,
  noindex = false,
  children 
}) {
  const siteName = 'BikinCode';
  const formattedTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <ErrorBoundary>
      <Head>
        {/* Basic Meta Tags */}
        <title>{formattedTitle}</title>
        <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />

        {/* OpenGraph Meta Tags */}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={formattedTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonical} />
        {ogImage && (
          <>
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={`Image for ${title}`} />
          </>
        )}

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={formattedTitle} />
        <meta name="twitter:description" content={description} />
        {ogImage && (
          <>
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={`Image for ${title}`} />
          </>
        )}

        {/* Accessibility Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <html lang="en" />

        {children}
      </Head>
    </ErrorBoundary>
  );
}