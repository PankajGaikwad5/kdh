import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import AboutClient from '../components/ClientComp/AboutClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

export const metadata = {
  title: 'About Page of Karan Desai Home',
  description:
    'Learn about Karan Desai — Award-winning Architecture + Interior Design Studio. Explore creative collections, luxury design philosophy, and craftsmanship at Karan Desai Home.',
  keywords: [
    'Karan Desai',
    'Karan Desai Home',
    'KDAD',
    'luxury interior design',
    'architecture and design',
    'designer collections',
    'modern decor',
    'art-inspired products',
    'award-winning design studio',
  ],
  openGraph: {
    title: 'About Page | Karan Desai Home',
    description:
      'Award-winning architecture and design studio redefining luxury and creativity.',
    url: 'https://www.karandesai.in/about',
    siteName: 'Karan Desai Home',
    images: [
      {
        url: '/assets/profile.jpg',
        width: 800,
        height: 800,
        alt: 'Karan Desai Profile',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main
      className={`min-h-screen bg-black text-white relative ${montserrat.className}`}
    >
      <Navbar />

      {/* Interactive + Animated Client Component (includes title + card) */}
      <AboutClient />

      <Footer />
    </main>
  );
}
