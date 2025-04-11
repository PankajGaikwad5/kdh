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
    'KDH',
    'Karan Desai Home',
    'karandesaihome',
    'KDAD',
    'Karan Desai',
    'Karan Desai Architecture and Design',
    'house design',
    'home design',
    'interior designers',
    'interior design',
    'interior decorators',
    'architecture design',
    'office interior design',
    'modern house design',
    'home plans',
    'house floor plans',
    'design interior design',
    'architect house design',
    'archi design',
    'design by architect',
    'new architect design',
    'interior architecture',
    'best interior designers in mumbai',
    'interior design companies',
    'interior and design',
    'architect home design',
    'architectural firms',
    'top interior designers',
    'home interior designers',
    'house planner',
    'home architecture design',
    'page design',
    'arch design',
    'architects in mumbai',
    'design mumbai',
    'design inside',
    'architects and designers',
    'architects home',
    'architecture firm',
    'design projects',
    'design a building',
    'design building design',
    'building for design',
    'archit design',
    'se arch',
    'architect design',
    'archi firm',
    'architecture companies',
    'architecture website',
    'architecture portfolio',
    'architect company',
    'urban design',
    'house architects',
    'architecture studio',
    'sustainable architecture',
    'architecture drawing',
    'architecture company',
    'sustainable',
    'architectural design competition',
    'architecture sites',
    'sustainable buildings',
    'homes',
    'architects website',
    'architects buildings',
    'housing architecture',
    'housing and architecture',
    'buildings into homes',
    'architects do what',
    'home architects',
    'make architecture',
    'playing store app',
    'google play gift card',
    'redeem google play code',
    'google play store console developer',
    'google play card gift card',
    'console playstore',
    'google play gift certificate',
    'google app store gift card',
    'console google play store',
    'google play store dev console',
    'home to design',
    'luxury interior design',
    'interior design website',
    'interior design a room',
    'modular kitchen designs',
    'furniture store',
    'dining table',
    'set of sofa',
    'table dining table',
    'furniture and furniture',
    'dining table and',
    'sofa with design',
    'and dining table',
    'settee design',
    'coffee',
    'coffee machine',
    'coffee beans',
    'espresso machine',
    'barista coffee',
    'us coffee',
    'coffee and machine',
    'coffee and cup',
    'designers studios',
    'design studio',
    'layout plan',
    'design a studio',
    'intermittent fasting',
    'free fasting',
    'fasting intermittent fasting',
    'intermittent diet fasting',
    'fasting and intermittent fasting',
    'intermittent fasting schedule',
    'intermittent fasting diet plan',
    'intermittent fasting times',
    'intermittent fasting benefits',
    'home decorating',
    'home decorate',
    'interior designers in bangalore',
    'home interior design',
    'interior designers in hyderabad',
    'interior designer in kolkata',
    'home decor ideas',
    'interior designers in pune',
    'living room design',
    'house interior design',
    'bedroom interior design',
    'home interior designers in bangalore',
    'home decor',
    'home of decor',
    'instagram videos',
    'instagram account',
    'instagram and videos',
    'instagram for videos',
    'ig videos',
    'instagram videography',
    'instagram coms',
    'instagram post',
    'instagram photos',
    'instagram instagram photos',
    'photos from instagram',
    'mumbai architecture',
    'design archi',
    'designer architects',
    'architecture and design',
    'karan desai architecture design',
    'mumbai design',
    'architecture inc',
    'lab in a lab',
    'lab in lab',
    'lab to lab',
    'lab re',
    'diagnostic centre in',
    'kitchen furniture',
    'kitchen sets',
    'furniture home',
    'kitchen cabinet',
    'kitchen furniture design',
    'kitchenette furniture',
    'kitchen and furniture',
    'furniture and home',
    'furniture and kitchen',
    'furniture of kitchen',
    'kitchen fur',
    'furniture & home',
    'kitchen wardrobe',
    'wardrobe furniture',
    'wardrobe lighting',
    'architecture home design',
    'architecture house design',
    'architecture firms near me',
    'building design',
    'architecture courses',
    'building design and',
    'architecture plan',
    'building architecture design',
    'building planner',
    'historic building',
    'architects consultants',
    'historic architecture',
    'architects building',
    'design associates',
    'building and architecture',
    'building in architecture',
    'interior design offices',
    'architectural designs for homes',
    'design on home',
    'new home design',
    'architect firm',
    'home planning',
    'interior design of home',
    'hafeez contractor architects',
    'interior design for house',
    'house architecture design',
    'modern house',
    'home plan',
    'house inside design',
    'architects design houses',
    'design and architect',
    'architect designers',
    'architect building design',
    'architect website',
    'architect for house',
    'floor plans',
    'house plans',
    'house plan design',
    'home design plans',
    'floor plan',
    'new house design',
    'house plan drawing',
    'architect in india',
    'design studio',
    'interior architect',
    'interior design india',
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
