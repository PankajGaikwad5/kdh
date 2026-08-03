import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  validateName,
  validateEmail,
  validateMessage,
  checkRateLimit,
} from '../../utils/spamDetection';

export async function POST(req) {
  const { values, honeypot, timestamp } = await req.json();
  const { name, email, message, subject, product, number } = values;

  // 1. Honeypot check - if filled, it's a bot
  if (honeypot) {
    console.log('Spam detected: Honeypot field filled');
    return NextResponse.json({ error: 'Submission rejected' }, { status: 400 });
  }

  // 2. Time-based check - form should take at least 3 seconds to fill
  if (timestamp) {
    const submissionTime = Date.now();
    const timeTaken = submissionTime - timestamp;

    // If submitted in less than 3 seconds, likely a bot
    if (timeTaken < 3000) {
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
  const rateLimitCheck = checkRateLimit(ip, 3, 3600000); // 3 submissions per hour

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
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email provider
    auth: {
      user: process.env.EMAIL, // your email address
      pass: process.env.PASS, // app-specific password
    },
  });

  let locationText = '';
  try {
    let fetchUrl = 'http://ip-api.com/json/';
    // If it's a real IP from a production request, use it.
    // Otherwise (localhost/unknown), it will use the server's external IP for testing.
    if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
      const cleanIp = ip.split(',')[0].trim();
      fetchUrl = `http://ip-api.com/json/${cleanIp}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const geoRes = await fetch(fetchUrl, { signal: controller.signal });
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

  // Set up email options
  const mailOptions = {
    from: `Karan Desai Home ${subject} Form${email}`, // sender's email
    to: `${process.env.REMAIL},  ${process.env.SECONDEMAIL}`, // recipient's email
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nContact No.: ${number}\nMessage: ${message}\n${
      product ? `product: ${product}` : ''
    }${locationText}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { msg: 'Email sent successfully!' },
      { status: 200 },
    );

    // await connectMongoDB();

    return NextResponse.json({ msg: 'Project saved successfully' });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json(
      { error: 'Error saving project' },
      { status: 500 },
    );
  }
}
