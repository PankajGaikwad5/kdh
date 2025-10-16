import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { values, group } = await req.json();
  const { name, email, phone } = values;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `Karan Desai Home Catalogue <${process.env.EMAIL}>`,
    to: `${process.env.REMAIL}, ${process.env.SECONDEMAIL}`,
    subject: `Catalogue Download Request - ${group}`,
    text: `Catalogue Download Request:
Name: ${name}
Email: ${email}
Phone: ${phone}
Collection: ${group}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ msg: 'Catalogue request sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
