import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_API_KEY, // generated ethereal password
  },
});

const sendMail = async (receiver, subject, message, html) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Rushikesh Patil 😀" <${process.env.SMTP_FROM}>`, // sender address
    to: receiver, // list of receivers
    subject, // Subject line
    text: message, // plain text body
    html: html || '<h1>Hello there</h1>', // html body
  });

  console.log('Message sent: %s', info.messageId);

  return info;
};

export default sendMail;
