import nodemailer from 'nodemailer';

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ Connection successful, credentials work!');
  } catch (err) {
    console.error('❌ Error verifying email config:', err);
  }
}

testEmail();
