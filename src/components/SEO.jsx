import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image = '/blog-hdpe-pond-liner.png',
  url,
  type = 'website'
}) => {
  const siteName = 'Yesha Enterprises';
  const defaultDescription = "Yesha Enterprises — India's premier wholesale distributor of Biofloc fish farming equipment, HDPE pond liners, ring blowers, and aeration systems in Raipur, Chhattisgarh with PAN India delivery.";
  const defaultKeywords = "Biofloc Fish Farming Equipment, HDPE Pond Liner Raipur, Ring Blower for Fish Farming, Biofloc Tank Supplier, Fish Pond Aerator India, Aquaculture Equipment Chhattisgarh";

  const seoTitle = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : `Biofloc Fish Farming Equipment & HDPE Pond Liner Supplier | ${siteName}`;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalUrl = url
    ? (url.startsWith('http') ? url.split('?')[0].split('#')[0] : `https://www.yeshaenterprises.in${url.startsWith('/') ? url : `/${url}`}`)
    : `https://www.yeshaenterprises.in${currentPath === '/' ? '/' : currentPath}`;

  const absoluteImage = image.startsWith('http')
    ? image
    : `https://www.yeshaenterprises.in${image.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:site" content="@yeshaenterprises" />

      {/* Advanced SEO */}
      <meta name="theme-color" content="#0e7490" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Language and Region */}
      <meta name="geo.region" content="IN-CT" />
      <meta name="geo.placename" content="Raipur" />
      <meta name="geo.position" content="21.2514;81.6296" />
      <meta name="ICBM" content="21.2514, 81.6296" />

      {/* Performance Booster */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    </Helmet>
  );
};

export default SEO;
