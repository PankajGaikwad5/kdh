// import { Geist, Geist_Mono } from "next/font/google";
// import {Giest, Geist_Mono} from 'next'
import './globals.css';
import { Inter } from 'next/font/google'; // Use a known Google font
import { Poppins, Montserrat } from 'next/font/google';
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
  title: 'Karan Desai Home',
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
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='Discover the innovative architectural designs of Karan Desai Home.'
        />
        <link rel='canonical' href='https://karandesaihome.com' />
        <meta property='og:title' content='Karan Desai Home' />
        <meta
          property='og:description'
          content='Discover the innovative architectural designs of Karan Desai Home.'
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
      <body className={`${montserrat.className} antialiased`}>
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
// ${geistSans.variable} ${geistMono.variable}
