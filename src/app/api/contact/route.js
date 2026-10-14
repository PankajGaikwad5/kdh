import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';
import {
  validateName,
  validateEmail,
  validateMessage,
  checkRateLimit,
} from '../../utils/spamDetection';
import {
  generateCustomerCartEmail,
  generateAdminCartEmail,
} from '../../utils/cartEmailTemplate';

// Force Node to prefer IPv4 over IPv6 to resolve DNS lookup failures on Windows (getaddrinfo ENOTFOUND / ETIMEDOUT smtp.gmail.com)
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore in older Node versions
}

export async function POST(req) {
  const { values, honeypot, timestamp } = await req.json();
  const {
    name,
    email,
    message,
    subject,
    product,
    number,
    location: clientLocation,
    isCart,
    source,
    cartItems,
  } = values || {};

  // Check if this inquiry originates specifically from the Cart
  const isCartSubmission = Boolean(
    isCart === true ||
    source === 'cart' ||
    (Array.isArray(cartItems) && cartItems.length > 0)
  );

  // 1. Honeypot check - if filled, it's a bot
  if (honeypot) {
    console.log('Spam detected: Honeypot field filled');
    return NextResponse.json({ error: 'Submission rejected' }, { status: 400 });
  }

  // 2. Time-based check - form should take at least 1.5 seconds to fill
  if (timestamp) {
    const submissionTime = Date.now();
    const timeTaken = submissionTime - timestamp;

    // If submitted in less than 1.5 seconds, likely a bot
    if (timeTaken < 1500) {
      console.log('Spam detected: Form submitted too quickly');
      return NextResponse.json(
        { error: 'Please take your time filling out the form' },
        { status: 400 },
      );
    }
  }

  // 3. Rate limiting by IP
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const rateLimitCheck = checkRateLimit(ip, 10, 3600000); // Allow up to 10 submissions per hour in testing

  if (!rateLimitCheck.allowed) {
    console.log('Spam detected: Rate limit exceeded for IP:', ip);
    return NextResponse.json({ error: rateLimitCheck.reason }, { status: 429 });
  }

  // 4. Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    console.log('Spam detected: Invalid name -', nameValidation.reason);
    return NextResponse.json(
      { error: 'Please provide a valid name' },
      { status: 400 },
    );
  }

  // 5. Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    console.log('Spam detected: Invalid email -', emailValidation.reason);
    return NextResponse.json(
      { error: 'Please provide a valid email address' },
      { status: 400 },
    );
  }

  // 6. Validate message (if provided)
  if (message && message.trim().length > 0) {
    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
      console.log('Spam detected: Invalid message -', messageValidation.reason);
      return NextResponse.json(
        { error: 'Please provide a valid message' },
        { status: 400 },
      );
    }
  }

  // Sanitize environment variables by stripping quotes and extra whitespace
  const emailUser = (process.env.EMAIL || '').replace(/['"]/g, '').trim();
  const emailPass = (process.env.PASS || '').replace(/['"]/g, '').replace(/\s+/g, '').trim();
  const recipient1 = (process.env.REMAIL || '').replace(/['"]/g, '').trim();
  const recipient2 = (process.env.SECONDEMAIL || '').replace(/['"]/g, '').trim();

  const recipients = [recipient1, recipient2].filter(Boolean).join(', ');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  let locationText = '';
  // Use client-sent location if available, otherwise attempt server-side IP geolocation
  if (clientLocation && clientLocation.trim()) {
    locationText = `\nLocation: ${clientLocation.trim()}`;
  } else if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1' && !ip.includes('localhost')) {
    try {
      const cleanIp = ip.split(',')[0].trim();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const geoRes = await fetch(`http://ip-api.com/json/${cleanIp}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          locationText = `\nLocation: ${geoData.city}, ${geoData.regionName}`;
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error.name === 'AbortError' ? 'Geolocation lookup timed out' : error);
    }
  }

  const referenceId = `KDH-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    if (isCartSubmission) {
      // 1. Send Admin Notification for Cart Enquiry
      const adminEmailData = generateAdminCartEmail({
        name,
        email,
        number,
        message,
        product,
        cartItems,
        locationText,
        referenceId,
      });

      const adminMailOptions = {
        from: `Karan Desai Home <${emailUser}>`,
        to: recipients || emailUser,
        replyTo: email,
        subject: subject || `Luxury Cart Enquiry [${referenceId}] - ${name}`,
        text: adminEmailData.text,
        html: adminEmailData.html,
      };

      await transporter.sendMail(adminMailOptions);

      // 2. Send Automated Confirmation Email to Customer (ONLY for cart enquiry)
      const customerEmail = (email || '').trim();
      if (customerEmail) {
        try {
          const customerEmailData = generateCustomerCartEmail({
            name,
            email: customerEmail,
            number,
            message,
            cartItems,
            referenceId,
          });

          const customerMailOptions = {
            from: `Karan Desai Home <${emailUser}>`,
            to: customerEmail,
            replyTo: 'info@karandesai.in',
            subject: customerEmailData.subject,
            text: customerEmailData.text,
            html: customerEmailData.html,
            attachments: customerEmailData.attachments,
          };

          await transporter.sendMail(customerMailOptions);
          console.log(`[CART ENQUIRY] Automated confirmation email successfully sent to customer: ${customerEmail}`);
        } catch (customerMailError) {
          console.error('[CART ENQUIRY] Error sending customer confirmation email to', customerEmail, ':', customerMailError);
          // Admin received the email, so we do not fail the submission
        }
      }
    } else {
      // Standard Non-Cart Form (e.g. Contact Us page):
      // Send ONLY to admin, do NOT send customer confirmation email
      const mailOptions = {
        from: `Karan Desai Home <${emailUser}>`,
        to: recipients || emailUser,
        replyTo: email,
        subject: subject || 'General Inquiry',
        text: `Name: ${name}\nEmail: ${email}\nContact No.: ${number || ''}\nMessage: ${message || ''}\n${
          product ? `Product(s): ${product}` : ''
        }${locationText}`,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json(
      { msg: 'Enquiry submitted successfully!', referenceId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error sending email:', error);

    // Fallback for development mode when SMTP is unreachable or fails
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV FALLBACK] Enquiry received:', {
        isCartSubmission,
        name,
        email,
        number,
        product,
        message,
        cartItemsCount: cartItems?.length,
      });
      return NextResponse.json(
        { msg: 'Enquiry submitted successfully! (Development Mode)', referenceId },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 },
    );
  }
}

