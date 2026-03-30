const nodemailer = require("nodemailer");
require("dotenv").config();

 async function sendApprovalEmail(
  approverEmail,
  experienceName,
  submittedBy,
  token
) {
  const transporter =
    process.env.NODE_ENV === "production"
      ? nodemailer.createTransport({
        sendmail: true,
        newline: "unix",
        path: "/usr/sbin/sendmail",
      })
      : nodemailer.createTransport({
        host: process.env.SMTP_HOST || "csmtp.telia.ee",
        port: process.env.SMTP_PORT || 587,
        secure: false, // STARTTLS
        auth: {
          user: process.env.TELIA_EMAIL,
          pass: process.env.TELIA_PASSWORD,
        },
        tls: { ciphers: "SSLv3" },
      });

  const link = `http://localhost:5173/approve?token=${token}`;

  await transporter.sendMail({
    from: `Approval System <${process.env.TELIA_EMAIL}>`,
    to: approverEmail,
    subject: "Vajalik kinnitus",
    html: `
     <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
    <div style="max-width:500px;margin:auto;background:white;padding:20px;border-radius:10px;border:1px solid #eee;">
      <div style="height:4px;background:#8ACE00;margin-bottom:15px;border-radius:2px;"></div>
      <h2 style="margin-top:0;">Kinnituse taotlus</h2>
      <p style="margin:8px 0;">
        <span style="color:#666;">Kogemus:</span><br>
        <b>${experienceName}</b>
      </p>
      <p style="margin:8px 0;">
        <span style="color:#666;">Esitas:</span><br>
        <b>${submittedBy}</b>
      </p>
      <p>Palun tee otsus:</p>
      <a href="${link}" 
         style="
           display:inline-block;
           padding:12px 22px;
           background:#8ACE00;
           color:black;
           text-decoration:none;
           border-radius:6px;
           font-weight:bold;
           box-shadow:0 2px 4px rgba(0,0,0,0.1);
         ">
         Ava taotlus
      </a>
      <p style="margin-top:20px;color:#666;font-size:14px;">
        Või kopeeri link:
      </p>
      <p style="word-break:break-all;font-size:14px;">
        ${link}
      </p>
    </div>
  </body>
    `,
  });
}

module.exports = { sendApprovalEmail };