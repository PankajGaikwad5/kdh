import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { values } = await req.json();
  const { name, email, message } = values;
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email provider
    auth: {
      user: process.env.EMAIL, // your email address
      pass: process.env.PASS, // app-specific password
    },
  });

  // Set up email options
  const mailOptions = {
    from: email, // sender's email
    to: process.env.REMAIL, // recipient's email
    subject: '3d Model Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { msg: 'Email sent successfully!' },
      { status: 200 }
    );

    // await connectMongoDB();

    return NextResponse.json({ msg: 'Project saved successfully' });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json(
      { error: 'Error saving project' },
      { status: 500 }
    );
  }
}
