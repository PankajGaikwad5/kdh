// import { Geist, Geist_Mono } from "next/font/google";
// import {Giest, Geist_Mono} from 'next'
import './globals.css';
import { Inter } from 'next/font/google'; // Use a known Google font
import { Poppins, Montserrat, Mate } from 'next/font/google';
import Footer from './components/Footer';
import Head from 'next/head';

// popins
// montserrat
const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});
const jose = Mate({
  subsets: ['latin'], // Specify subsets
  weight: ['400'], // Specify weight
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

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
  keywords: [
    'KDAD',
    'Karan Desai',
    'Karan Desai Architecture and Design',
    'modern architecture',
    'contemporary architecture',
    'innovative architecture',
    'creative architecture',
    'architectural design',
    'modern design',
    'sustainable architecture',
    'eco-friendly design',
    'residential architecture',
    'commercial architecture',
    'interior design',
    'architectural portfolio',
    'design studio',
    'dimension',
    'dimension store',
    'dimensions india',
    'Quarry',
    'the quarry',
    'gattoo',
    'gatto chair',
    'casa walls',
    'bharat flooring',
    'serafini',
    'monster collection',
    'monster collection 2022',
    'monster collection 2023',
    'monster collection 2024',
    'monster collection 2025',
    'top brewer',
    'foremost marbles',
    'architecture',
    'design',
    'architect',
    'architectural',
    'architectural design',
    'architecture design',
    'design studio',
    'design firm',
    'design company',
    'architecture company',
    'architecture studio',
    'architecture firm',
    'architectural firm',
    'architectural studio',
    'urban design',
    'minimalist design',
    'award-winning architecture',
    'architecture firm',
    'creative design solutions',
    'luxury architecture',
    'modern building design',
    'architectural innovation',
    'architectural trends',
    'design inspiration',
    'architectural projects',
    'design projects',
    'house planner',
    'architecture design',
    'arch design',
    'archit design',
    'home architecture design',
    'home planner',
    'design latest',
    'latest design',
    'architecture drawing',
    'solutions architecture',
    'home build plan',
    'architecture modern design',
    'modern design and architecture',
    'modern architecture and design',
    'modern architecture',
    'layout plan',
    'architecture sustainable',
    'ghar ka model',
    'india design',
    'modern archi',
    'archi logo',
    'design archi',
    'sustainable design',
    'house layout',
    'design india',
    'designing india',
    'design solutions',
    'veedu design',
    'architecture and design logo',
    'architecture design logo',
    'design innovative',
    'architecture projects',
    'archi projects',
    'architecture india',
    'home lay out',
    'project on architecture',
    'innovative design',
    'architect architects',
    'designing a sustainable home',
    'architecture and design',
    'architecture from home',
    'and architecture & design',
    'architecture and design india',
    'architecture design in india',
    'ghar ka diagram',
    'ghar ka dijaen',
    'ghar ka style',
    'ghar ke model',
    'karan desai architecture design',
    'design ke design',
    'innovative architecture',
    'design ka ghar',
    'architecture features',
    'architecture of the us',
    'dijain home',
    'feature architecture',
    'ghar ka digain',
    'latest architecture design',
    'archi design new model',
    'sustainable design architecture',
    'sustainable design and architecture',
    'sustainable designs in architecture',
    'latest architecture design for home',
    'ghar ke digain',
    'modernist designers',
    'architecture inside',
    'design ke ghar',
    'ghar ki digain',
    'instagram architecture',
    'ghar ki dijaen',
    'in design architecture',
    'ghar disain',
    'home dizan',
    'design solutions architecture',
    'artitec design',
    'architecture and branding',
    'the design architecture',
    'architecture design instagram',
    'architecture design project',
    'ghar ka latest design',
    'ghar ka sample',
    'ghar ke dijaen',
    'home customize',
    'instagram architecture design',
    'project architecture design',
    'project design architecture',
    'architecture of design',
    'a design architecture',
    'innovative architecture design',
    'architecture design in',
    'us architecture',
    '_ design',
    'architecture contact',
    'home dijayen',
    'home dijayin',
    'logos architecture',
    'modern home logos',
    'the architecture design',
    'modern home designers',
    'sustainable projects architecture',
    'building ka model',
    'design modernism',
    'ghar ka design design',
    'ghar ka naksha model',
    'latest architecture',
    'i design architecture',
    'traditional building design',
    'latest design latest design',
    'design design for project',
    'home design and architecture',
    'sustainable design solutions',
    'design it architecture',
    'it architecture and design',
    'sustainable design projects',
    'about architecture design',
    'sustainable modern architecture',
    'sustainable architecture features',
    'architecture+ design',
    'modern it architecture',
    'design the architecture',
    'desai designs',
    'design features architecture',
    'it design architecture',
    'modern design solutions',
    'innovative sustainable design',
    'modern architecture sustainable design',
    'design features in architecture',
    'design and solutions',
    'i design solutions',
    'at architecture and design',
    'architecture about us',
    'innovative sustainable architecture',
    'anb design',
    'modern architecture designers',
    'a home designer',
    'architect de solution',
    'sustainable design features',
    'about modern architecture',
    'architecture and modernity',
    'arq art',
    'contact architecture',
    'features of modern architecture',
    'futuristic sustainable architecture',
    'in home designer',
    'innovative architecture projects',
    'innovative design projects',
    'latest modern design',
    'modern architecture projects',
    'modern design features',
    'new modernism architecture',
    'nice modern architecture',
    'project for architecture',
    'regarding design',
    'solu design',
    'sustainable design in india',
    'sustainable design india',
    'the modern architecture',
    'tva design',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content={`Discover the innovative architectural designs of Karan Desai Home. Karan Desai Award Winning Architecture + Interior Design Studio | TedX
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
      <body className={`tracking-widest antialiased ${jose.className}`}>
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
// ${geistSans.variable} ${geistMono.variable}
