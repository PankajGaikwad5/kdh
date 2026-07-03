'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Poppins, Montserrat } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const TermsAndConditions = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Page fade-in
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });

      // Title clip reveal
      tl.fromTo(
        headerRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' },
        0.2
      );

      // Content slide-up
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        0.4
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-white selection:text-black"
    >
      {/* Background SVG Grid Pattern matching contact page */}
      <div
        className="flex-1"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundAttachment: 'fixed',
        }}
      >
        <Navbar arrow={true} />

        <main className="pt-24 pb-16 max-w-4xl mx-auto px-6 sm:px-8">
          <div className="w-full text-center flex justify-center mb-12">
            <h1
              ref={headerRef}
              className={`text-3xl sm:text-4xl font-bold text-gray-200 pb-6 border-b border-zinc-800 uppercase tracking-widest w-full md:max-w-2xl ${montserrat.className}`}
            >
              Terms & Conditions
            </h1>
          </div>

          <div
            ref={contentRef}
            className={`space-y-10 text-sm tracking-wide leading-relaxed text-zinc-300 ${poppins.className}`}
          >
            <section className="space-y-3">
              <p className="font-light">
                Last updated: July 2026
              </p>
              <p className="font-light">
                Welcome to <strong>Karan Desai Home</strong>. By accessing or using our website <a href="https://karandesaihome.com" className="underline hover:text-white transition-colors">karandesaihome.com</a> (the "Site"), you agree to comply with and be bound by the following Terms and Conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not access or use the Site.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                1. Acceptance of Terms
              </h2>
              <p className="font-light">
                These terms govern your access to the Site, including all materials, portfolios, images, catalogs, products, and contact portals. We reserve the right to modify these terms at any time without prior notice. Your continued use of the Site after updates are posted constitutes acceptance of the revised terms.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                2. Intellectual Property Rights
              </h2>
              <p className="font-light text-zinc-300">
                All contents published on this Site, including but not limited to furniture designs, decor layouts, conceptual renderings, photographic images, logos, graphics, text, and custom software code, are the intellectual property of <strong>Karan Desai Home</strong> and/or its creators (Karan Desai, KDAD). 
              </p>
              <p className="font-light text-zinc-300">
                You are strictly prohibited from copying, distributing, mirroring, modifying, republishing, or commercially exploiting any visual materials, products, or portfolios from this Site without explicit, prior written consent from us.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                3. User Submissions & Contact Forms
              </h2>
              <p className="font-light">
                When sending inquiry data through our contact form, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-light">
                <li>Provide accurate, current, and complete details as prompted by the form.</li>
                <li>Refrain from submitting any materials that are illegal, fraudulent, harmful, or designed to disrupt the Site's security (including spam, bot submissions, or malicious scripts).</li>
              </ul>
              <p className="font-light">
                Any submission filled on the Site is governed by our Privacy Policy. We reserve the right to disregard, ignore, or block submissions containing incorrect or suspicious information.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                4. Third-Party Links & Analytics Tools
              </h2>
              <p className="font-light text-zinc-300">
                Our Site relies on analytical systems (Google Analytics, Google Search Console) to evaluate traffic and technical issues. We also offer links to external resources (such as Instagram, LinkedIn, and WhatsApp). We are not responsible for the privacy practices, content, or accuracy of third-party platforms. Your interaction with any external service is entirely at your own risk.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                5. Disclaimer of Warranties & Limitation of Liability
              </h2>
              <p className="font-light text-zinc-300">
                The Site and its contents are provided on an "as-is" and "as-available" basis. We make no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, availability, or suitability of the information and designs presented.
              </p>
              <p className="font-light text-zinc-300">
                Karan Desai Home shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to, use of, or inability to use the Site or any errors or omissions in its content.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                6. Governing Law & Jurisdiction
              </h2>
              <p className="font-light text-zinc-300">
                These terms and any disputes relating to the Site shall be governed by, interpreted, and enforced in accordance with the laws of <strong>India</strong>. You agree that any legal actions or proceedings arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Mumbai, Maharashtra, India</strong>.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                7. Contact Information
              </h2>
              <p className="font-light">
                If you have questions or concerns regarding these Terms & Conditions, please contact us:
              </p>
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded space-y-1 text-sm font-light text-zinc-400">
                <p className="text-white font-medium">Karan Desai Home</p>
                <p>Shah Industrial Estate, 1001 PARINEE I, 7-A, Andheri West,</p>
                <p>Mumbai, Maharashtra 400053, India</p>
                <p>Email: <a href="mailto:info@karandesai.in" className="underline hover:text-white transition-colors">info@karandesai.in</a></p>
                <p>Phone: +91 7977112242</p>
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
