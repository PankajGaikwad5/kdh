// import { Geist, Geist_Mono } from "next/font/google";
// import {Giest, Geist_Mono} from 'next'
import './globals.css';
import { Inter } from 'next/font/google'; // Use a known Google font
import { Montserrat } from 'next/font/google';
// import { Poppins, Montserrat, Mate } from 'next/font/google';
import Footer from './components/Footer';
import Head from 'next/head';
import Script from 'next/script';
import GoogleAnalytics from '../components/GoogleAnalytics';

// popins
// montserrat
// const popins = Poppins({
//   subsets: ['latin'], // Specify subsets
//   weight: ['400', '600', '700'], // Specify weight
//   display: 'swap',
// });
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
  display: 'swap',
});
// const jose = Mate({
//   subsets: ['latin'], // Specify subsets
//   weight: ['400'], // Specify weight
//   display: 'swap',
// });

// const inter = Inter({
//   variable: '--font-inter',
//   subsets: ['latin'],
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: `Karan Desai Home | Luxury Décor, Furniture & Lifestyle`,
  description: `Discover award-winning architectural and interior designs by Karan Desai Home – led by TedX Speaker and visionary architect Karan Desai.`,
  metadataBase: new URL('https://karandesaihome.com'),
  openGraph: {
    title: 'Karan Desai Home',
    description: 'Award Winning Architecture + Interior Design Studio',
    url: 'https://karandesaihome.com',
    images: ['/assets/newkdh.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karan Desai Home',
    description:
      'Discover the innovative architectural designs of Karan Desai Home.',
    images: ['/assets/newkdh.png'],
  },
  alternates: {
    canonical: 'https://karandesaihome.com',
  },
  keywords: [
    // Brand & Collections
    'Karan Desai Home',
    'KDH',
    'KDAD',
    'Karan Desai Collection',
    'Karan Desai Luxury Products',
    'Monster Collection',
    'Monster 1.0',
    'Monster 2.0',
    'Matilda Collection',
    'Serafini Collection',
    'Karan Desai Exclusive',
    'Designer Collections by Karan Desai',
    'KDAD Editions',

    // Luxury Product & Design
    'luxury home decor',
    'designer collectibles',
    'limited edition products',
    'unique luxury items',
    'exclusive decor pieces',
    'handcrafted designer items',
    'artistic home decor',
    'sculptural art objects',
    'modern luxury decor',
    'premium lifestyle design',
    'collectible home accessories',
    'contemporary design objects',
    'designer statement pieces',
    'artisanal luxury creations',

    // Product Categories
    'luxury furniture',
    'designer lighting',
    'decorative sculptures',
    'collectible art pieces',
    'modern home accessories',
    'limited edition furniture',
    'exclusive table decor',
    'home art objects',
    'luxury design gifts',
    'designer wall art',
    'signature decor series',

    // Audience & Intent
    'for art collectors',
    'for design lovers',
    'for luxury homes',
    'for modern interiors',
    'unique gifts for home',
    'designer pieces for interiors',
    'home styling ideas',
    'statement pieces for interiors',

    // Brand Positioning / Context
    'where art meets design',
    'limited edition designer collections',
    'redefining luxury decor',
    'collectible design objects',
    'exclusive art-inspired products',
    'crafted with precision',
    'inspired by art and architecture',
    'modern collectible design',

    // Location / Market
    'luxury products in Mumbai',
    'designer collections India',
    'exclusive decor India',
    'Karan Desai Home India',
  ],
};

export default function RootLayout({ children }) {
  const organizationSchema = {
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
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Karan Desai Home specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karan Desai Home specializes in luxury furniture design, designer collections, and functional art pieces. We create meticulously crafted furniture and products that transform everyday spaces into rich, immersive experiences.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Karan Desai Home located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karan Desai Home is based in Mumbai, India. The studio has completed projects across India and internationally, including projects in Chicago and Washington, D.C.',
        },
      },
      {
        '@type': 'Question',
        name: 'What collections does Karan Desai Home offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our collections include Monster 1.0, 2.0, 3.0, and 3.1, Matilda collections (2022-2025), Monster Collectibles, KD X Serafini collaboration, and Monsformer. Each features unique, limited-edition designer pieces.',
        },
      },
    ],
  };

  return (
    <html lang='en'>
      <body className={`tracking-widest antialiased ${montserrat.className}`}>
        {/* Structured Data for AEO */}
        <Script
          id='organization-schema'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id='faq-schema'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Meta Pixel */}
        <Script id='meta-pixel' strategy='afterInteractive'>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4111080902498732');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* NoScript fallback */}
        <noscript>
          <img
            height='1'
            width='1'
            style={{ display: 'none' }}
            src='https://www.facebook.com/tr?id=4111080902498732&ev=PageView&noscript=1'
            alt=''
          />
        </noscript>
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
// ${geistSans.variable} ${geistMono.variable}
