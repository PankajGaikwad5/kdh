// import { Geist, Geist_Mono } from "next/font/google";
// import {Giest, Geist_Mono} from 'next'
import './globals.css';
import { Inter } from 'next/font/google'; // Use a known Google font
import { Poppins, Montserrat } from 'next/font/google';
import Footer from './components/Footer';

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
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${montserrat.className} antialiased`}>
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
// ${geistSans.variable} ${geistMono.variable}
