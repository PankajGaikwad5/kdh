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
  title: 'About | Karan Desai Home',
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
    title: 'About | Karan Desai Home',
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

      {/* SEO-Friendly Static Title */}
      <section className='text-center pt-24 mb-10'>
        <h1 className='text-4xl md:text-5xl font-light tracking-tight uppercase'>
          About
        </h1>
        <p className='mt-3 text-gray-400 max-w-2xl mx-auto text-sm md:text-base'>
          Award-winning Architecture and Interior Design studio by Karan Desai.
          Crafting luxury spaces and designer collections inspired by art and
          innovation.
        </p>
      </section>

      {/* Interactive + Animated Client Component */}
      <AboutClient />

      <Footer />
    </main>
  );
}
