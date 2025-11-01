// import { Geist, Geist_Mono } from "next/font/google";
// import {Giest, Geist_Mono} from 'next'
import './globals.css';
import { Inter } from 'next/font/google'; // Use a known Google font
import { Montserrat } from 'next/font/google';
// import { Poppins, Montserrat, Mate } from 'next/font/google';
import Footer from './components/Footer';
import Head from 'next/head';
import Script from 'next/script';

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
  title: `Karan Desai Home `,
  description: `Discover the innovative architectural designs of Karan Desai Home. Karan Desai Award Winning Architecture + Interior Design Studio | TedX
          Speaker Karan DesaiBorn in 1987, a passionate founder of his eponymous
          studio, KARAN DESAI | Architecture + Design, focusing on Architecture,
          Interiors & furniture designing, KD started off with his individual
          practice right after he gave his Thesis in 2011 from Pillai’s college
          of architecture & founded the company in 2012. The internship under
          Ar. Ashiesh Shah during a year drop in 2007, carved a path for his
          career with a clear direction towards his goals & dreams which he
          lives today.`,
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
  keywords = [
  // Brand & Collections
  "Karan Desai Home",
  "KDH",
  "KDAD",
  "Karan Desai Collection",
  "Karan Desai Luxury Products",
  "Monster Collection",
  "Monster 1.0",
  "Monster 2.0",
  "Matilda Collection",
  "Serafini Collection",
  "Karan Desai Exclusive",
  "Designer Collections by Karan Desai",
  "KDAD Editions",

  // Luxury Product & Design
  "luxury home decor",
  "designer collectibles",
  "limited edition products",
  "unique luxury items",
  "exclusive decor pieces",
  "handcrafted designer items",
  "artistic home decor",
  "sculptural art objects",
  "modern luxury decor",
  "premium lifestyle design",
  "collectible home accessories",
  "contemporary design objects",
  "designer statement pieces",
  "artisanal luxury creations",

  // Product Categories
  "luxury furniture",
  "designer lighting",
  "decorative sculptures",
  "collectible art pieces",
  "modern home accessories",
  "limited edition furniture",
  "exclusive table decor",
  "home art objects",
  "luxury design gifts",
  "designer wall art",
  "signature decor series",

  // Audience & Intent
  "for art collectors",
  "for design lovers",
  "for luxury homes",
  "for modern interiors",
  "unique gifts for home",
  "designer pieces for interiors",
  "home styling ideas",
  "statement pieces for interiors",

  // Brand Positioning / Context
  "where art meets design",
  "limited edition designer collections",
  "redefining luxury decor",
  "collectible design objects",
  "exclusive art-inspired products",
  "crafted with precision",
  "inspired by art and architecture",
  "modern collectible design",

  // Location / Market
  "luxury products in Mumbai",
  "designer collections India",
  "exclusive decor India",
  "Karan Desai Home India"
]

};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content={`Discover the innovative product designs of Karan Desai Home. Karan Desai Award Winning Architecture + Interior Design Studio | TedX
          Speaker Karan DesaiBorn in 1987, a passionate founder of his eponymous
          studio, KARAN DESAI | Architecture + Design, focusing on Architecture,
          Interiors & furniture designing, KD started off with his individual
          practice right after he gave his Thesis in 2011 from Pillai’s college
          of architecture & founded the company in 2012. The internship under
          Ar. Ashiesh Shah during a year drop in 2007, carved a path for his
          career with a clear direction towards his goals & dreams which he
          lives today. The Studio has spread its wings in Mangalore, Goa, Delhi,
          Kullu - Manali, Uttarakhand, Kolkata, Chennai and plan to continue.
          Inspired by contemporary aesthetics and clean lines, the studio
          beautifies projects both residential and commercial on varying scales.
          From ideation rooms to offices , homes to private getaways, the team
          designs projects and products in close association with clients to
          deliver unique results and reflect personal tastes with consolidating
          the studio’s vision. We're also doing projects internationally, We've
          completed working on the order of 20,000 sq.ft. in Chicago and
          currently working on 15,000 sq.ft Mansion in Washington, D.C.`}
        />
        <link rel='canonical' href='https://karandesaihome.com' />
        <meta
          property='og:title'
          content={`Karan Desai Home "Imagine transforming everyday spaces into rich, immersive
          experiences—what if art became a part of your daily life?" Karan Desai
          Home is a testament to bringing the experience through meticulously
          crafted furniture and products. KDH specialises in creating art pieces
          that are not only visually striking but also serve a functional
          purpose. Following the success of our Monster collection in 2022, we
          have consistently expanded our portfolio, collaborating with renowned
          industry leaders such as The Quarry, Casa Walls, Bharat Flooring, and
          more. Our dedication to design innovation has earned us international
          recognition, including a prestigious partnership with Serafini
          (Italy). With a commitment to global collaborations and a mission to
          craft extraordinary designs, KDH continues to redefine functional art.
          Our unique approach and creative philosophy aim to inspire and
          captivate, bringing exceptional products to life.`}
        />
        <meta
          property='og:description'
          content="Discover the innovative architectural designs of Karan Desai Home. Karan Desai Award Winning Architecture + Interior Design Studio | TedX
          Speaker Karan DesaiBorn in 1987, a passionate founder of his eponymous
          studio, KARAN DESAI | Architecture + Design, focusing on Architecture,
          Interiors & furniture designing, KD started off with his individual
          practice right after he gave his Thesis in 2011 from Pillai’s college
          of architecture & founded the company in 2012. The internship under
          Ar. Ashiesh Shah during a year drop in 2007, carved a path for his
          career with a clear direction towards his goals & dreams which he
          lives today. The Studio has spread its wings in Mangalore, Goa, Delhi,
          Kullu - Manali, Uttarakhand, Kolkata, Chennai and plan to continue.
          Inspired by contemporary aesthetics and clean lines, the studio
          beautifies projects both residential and commercial on varying scales.
          From ideation rooms to offices , homes to private getaways, the team
          designs projects and products in close association with clients to
          deliver unique results and reflect personal tastes with consolidating
          the studio’s vision. We're also doing projects internationally, We've
          completed working on the order of 20,000 sq.ft. in Chicago and
          currently working on 15,000 sq.ft Mansion in Washington, D.C."
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://karandesaihome.com' />
        <meta
          property='og:image'
          content='https://karandesaihome.com/og-image.jpg'
        />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Karan Desai Home' />
        <meta
          name='twitter:description'
          content='Discover the innovative architectural designs of Karan Desai Home.'
        />
      </Head>
      <body className={`tracking-widest antialiased ${montserrat.className}`}>
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
