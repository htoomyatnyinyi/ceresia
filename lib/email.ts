export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  console.log(`Sending password reset email to ${email}`);
  console.log(`Reset URL: ${resetUrl}`);
  // Replace with real email service in production, e.g.:
  /*
  import nodemailer from "nodemailer";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: "your-app@example.com",
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
  */
}

export async function sendVerificationEmail(email: string, verifyUrl: string) {
  console.log(`Sending verification email to ${email}`);
  console.log(`Verification URL: ${verifyUrl}`);
  // Replace with real email service in production, e.g.:
  /*
  import nodemailer from "nodemailer";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: "your-app@example.com",
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. This link expires in 24 hours.</p>`,
  });
  */
}

// export async function sendPasswordResetEmail(email: string, resetUrl: string) {
//   // Mock implementation: Log the reset URL for testing
//   console.log(`Sending password reset email to ${email}`);
//   console.log(`Reset URL: ${resetUrl}`);
//   // In production, replace with real email service, e.g.:
//   /*
//   import nodemailer from "nodemailer";
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//   });
//   await transporter.sendMail({
//     from: "your-app@example.com",
//     to: email,
//     subject: "Password Reset Request",
//     html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
//   });
//   */
// }
