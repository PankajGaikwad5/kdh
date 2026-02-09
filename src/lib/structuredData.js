/**
 * Structured Data Generators for AEO (Answer Engine Optimization)
 * These schemas help AI bots understand and extract information about Karan Desai Home
 */

/**
 * Organization Schema - Tells AI bots about the business
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Karan Desai Home',
    alternateName: ['KDH', 'KDAD', 'Karan Desai Architecture + Design'],
    url: 'https://karandesaihome.com',
    logo: 'https://karandesaihome.com/assets/kdhlogo3.png',
    description:
      'Award-winning architecture and interior design studio specializing in luxury furniture, designer collections, and functional art. Founded by TedX speaker and visionary architect Karan Desai.',
    founder: {
      '@type': 'Person',
      name: 'Karan Desai',
      jobTitle: 'Architect and Designer',
      description: 'TedX Speaker, Award-winning Architect and Designer',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'Country',
        name: 'United States',
      },
    ],
    knowsAbout: [
      'Architecture',
      'Interior Design',
      'Furniture Design',
      'Luxury Home Decor',
      'Designer Collections',
      'Functional Art',
    ],
    sameAs: [
      // Add social media profiles here when available
    ],
  };
}

/**
 * FAQ Schema - Common questions AI bots should be able to answer
 */
export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Karan Desai Home specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karan Desai Home specializes in luxury furniture design, designer collections, and functional art pieces. We create meticulously crafted furniture and products that transform everyday spaces into rich, immersive experiences. Our collections include the Monster series, Matilda collections, and exclusive collaborations with international brands.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the main collections offered by Karan Desai Home?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our main collections include: Monster 1.0 (collaboration with The Quarry), Monster 2.0 (with TopBrewer and Bharat Flooring), Monster 3.0 and 3.1 (with Dimensions), Matilda collections (2022-2025), Monster Collectibles (with Arjun Rathi), KD X Serafini collaboration, and Monsformer (with Blum). Each collection features unique, limited-edition designer pieces.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Karan Desai Home located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karan Desai Home is based in Mumbai, India. The studio has completed projects across India including Mangalore, Goa, Delhi, Kullu-Manali, Uttarakhand, Kolkata, and Chennai. We also work internationally, with completed projects in Chicago (20,000 sq.ft.) and ongoing work in Washington, D.C. (15,000 sq.ft mansion).',
        },
      },
      {
        '@type': 'Question',
        name: 'Who is Karan Desai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Karan Desai is an award-winning architect, interior designer, and TedX speaker. Born in 1987, he founded KARAN DESAI | Architecture + Design in 2012 after graduating from Pillai's College of Architecture in 2011. He focuses on contemporary aesthetics, clean lines, and creating unique designs that blend art with functionality.",
        },
      },
      {
        '@type': 'Question',
        name: 'What international collaborations has Karan Desai Home done?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karan Desai Home has collaborated with several renowned international brands including Serafini (Italy), The Quarry, TopBrewer, Bharat Flooring, Casa Walls, Dimensions, Blum, and Arjun Rathi. These partnerships have resulted in exclusive, limited-edition designer collections.',
        },
      },
      {
        '@type': 'Question',
        name: 'What type of projects does Karan Desai Home work on?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karan Desai Home works on both residential and commercial projects of varying scales, from ideation rooms and offices to homes and private getaways. The studio also designs furniture and product collections. Projects range from intimate spaces to large-scale developments, including international projects up to 20,000 square feet.',
        },
      },
    ],
  };
}

/**
 * Product Schema Generator - For individual collections
 */
export function getProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Karan Desai Home',
    },
    image: product.image,
    category: 'Luxury Furniture & Home Decor',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
    },
  };
}

/**
 * Breadcrumb Schema Generator
 */
export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * LocalBusiness Schema - For local search and AI location queries
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://karandesaihome.com',
    name: 'Karan Desai Home',
    image: 'https://karandesaihome.com/assets/kdhlogo3.png',
    description:
      'Luxury furniture and designer collections studio in Mumbai, India. Award-winning architecture and interior design by Karan Desai.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'IN',
    },
    url: 'https://karandesaihome.com',
    priceRange: 'Premium',
    servesCuisine: null,
    openingHours: 'Mo-Sa 10:00-18:00',
  };
}
