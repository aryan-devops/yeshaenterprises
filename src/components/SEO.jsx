import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website'
}) => {
  const siteName = 'Yesha Enterprises';
  const defaultDescription = "Yesha Enterprises — India's biggest HDPE Pond Liner dealer and wholesale distributor of Biofloc Fish Farming products in Raipur, Chhattisgarh. PAN India delivery.";
  const defaultKeywords = "Biofloc Fish Farming India, HDPE Pond Liner Raipur, Fish Tank Manufacturers Chhattisgarh, Ring Blower for Fish Farming, Aquaculture Equipment Distributor, Pond Liner Wholesale India, Biofloc Tank Prices, Industrial Grade Pond Liners, Fish Farming Aeration Systems, Biofloc Setup Cost India, Geomembrane Sheets for Ponds, Best Pond Liner Dealer Raipur, Fish Farming Solutions Chhattisgarh, HDPE Sheet for Agriculture, Biofloc Farming Training India, Aquaculture Infrastructure Solutions, High Density Polyethylene Liners, Fish Pond Aerators India, Biofloc Product Suppliers, Water Management for Fish Farming";

  const seoTitle = title ? `${title} | ${siteName}` : siteName;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image} />
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
