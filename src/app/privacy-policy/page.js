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

const PrivacyPolicy = () => {
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
              Privacy Policy
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
                At <strong>Karan Desai Home</strong> (referred to as "we", "us", or "our"), safeguarding your privacy is of paramount importance. This Privacy Policy details how we collect, use, process, and protect the information obtained when you visit and interact with our website <a href="https://karandesaihome.com" className="underline hover:text-white transition-colors">karandesaihome.com</a>.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                1. Information We Collect
              </h2>
              <div className="space-y-3 font-light">
                <p>We collect information in two ways: voluntarily provided information and automatically captured site metrics.</p>
                
                <h3 className="text-white font-medium mt-2">A. Information Provided Voluntarily</h3>
                <p>
                  When you use our <strong>Contact Form</strong>, you submit personal data directly to us. This data includes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Contact Number</li>
                  <li>Subject and Message Content</li>
                </ul>

                <h3 className="text-white font-medium mt-4">B. Information Collected Automatically</h3>
                <p>
                  We integrate tracking systems to monitor performance and optimize website usage:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>
                    <strong>Google Analytics:</strong> Collects user data such as IP address, browser type, device details, pages viewed, time spent on pages, and referral sources. This details general user behavior but does not personally identify individuals.
                  </li>
                  <li>
                    <strong>Google Search Console:</strong> Collects search query data, click-through rates, and technical system health to assist in website indexing and technical SEO audits.
                  </li>
                  <li>
                    <strong>Cookies:</strong> Small tracking files placed on your device to distinguish visitors and run analytics functionality.
                  </li>
                </ul>
              </div>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                2. How We Use Your Information
              </h2>
              <p className="font-light">
                We use the gathered information to provide custom architectural and interior experiences:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-light">
                <li>To address client inquiries, schedule design appointments, and provide support.</li>
                <li>To evaluate overall traffic behavior patterns and improve the visual layout, usability, and stability of our website.</li>
                <li>To detect, prevent, and troubleshoot potential technical problems or security issues.</li>
              </ul>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                3. Cookies and Third-Party Tracking
              </h2>
              <p className="font-light">
                Our site uses cookies to ensure analytics tools (such as Google Analytics and Meta Pixel) function correctly. You have complete control over cookies through:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-light">
                <li>
                  Our <strong>Cookie Consent Banner</strong>, which allows you to consent to or decline analytics tracking upon entering the website.
                </li>
                <li>
                  Your browser's built-in preferences, which allow you to block or delete cookies entirely.
                </li>
              </ul>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                4. Data Security & Storage
              </h2>
              <p className="font-light text-zinc-300">
                We employ robust security practices to protect your data from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no transmission method over the Internet or digital storage device is completely secure. We strive to use commercially acceptable means to protect your personal details but cannot guarantee absolute security.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                5. Your Data Rights
              </h2>
              <p className="font-light">
                Depending on your location, you may have specific privacy rights, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-light">
                <li>The right to request copies of the personal details we hold about you.</li>
                <li>The right to request corrections to any inaccurate details.</li>
                <li>The right to request deletion of your details from our records.</li>
              </ul>
              <p className="font-light">
                To exercise any of these rights, please email us directly at the contact address listed below.
              </p>
            </section>

            <hr className="border-zinc-900" />

            <section className="space-y-4">
              <h2 className={`text-lg font-semibold text-white uppercase tracking-wider ${montserrat.className}`}>
                6. Contact Information
              </h2>
              <p className="font-light">
                For questions regarding this Privacy Policy or data handling practices, please contact us at:
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

export default PrivacyPolicy;
