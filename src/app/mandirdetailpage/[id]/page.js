import { mandirs } from '@/app/components/mandirsData';
import MandirDetailsClient from '@/app/components/pageComp/MandirDetailsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const mandir = mandirs.find((p) => {
    const mandirId = typeof p._id === 'object' ? p._id.$oid : p._id;
    return mandirId === params.id;
  });

  if (!mandir) return {};

  return {
    title: mandir.title,
    description:
      mandir.description ||
      `${mandir.title} - Mandir specifications and details`,
    keywords: `${mandir.title}, ${
      mandir.location || ''
    }, mandir, interior design`,
    alternates: {
      canonical: `https://karandesaihome.com/mandirdetailpage/${mandir._id.$oid}`,
    },
    openGraph: {
      title: 'Karan Desai Home',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

export default function MandirDetailsPage({ params }) {
  const mandir = mandirs.find((p) => {
    const mandirId = typeof p._id === 'object' ? p._id.$oid : p._id;
    return mandirId === params.id;
  });

  if (!mandir) notFound();

  return <MandirDetailsClient product={mandir} />;
}
