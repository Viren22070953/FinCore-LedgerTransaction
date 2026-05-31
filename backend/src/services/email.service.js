const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount,  receiverName) {
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of ₹${amount} to account ${receiverName} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of ₹${amount} to account ${receiverName} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, receiverName) {
    const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of ₹${amount} to account ${receiverName} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of ₹${amount} to account ${receiverName} has failed. Please try again later.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendPasswordResetEmail(userEmail, name, resetLink) {
    const subject = "Password Reset Request";

    const text = `
Hello ${name},

We received a request to reset your password.

Click the link below to reset your password:

${resetLink}

This link will expire in 10 minutes.

If you did not request a password reset, please ignore this email.

Best Regards,
Backend Ledger Team
`;

    const html = `
        <div style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>

            <p>Hello <strong>${name}</strong>,</p>

            <p>We received a request to reset your password.</p>

            <p>
                <a href="${resetLink}"
                   style="
                     background-color:#2563eb;
                     color:white;
                     padding:10px 20px;
                     text-decoration:none;
                     border-radius:5px;
                     display:inline-block;
                   ">
                    Reset Password
                </a>
            </p>

            <p>This link will expire in <strong>10 minutes</strong>.</p>

            <p>If you did not request a password reset, please ignore this email.</p>

            <p>
                Best Regards,<br>
                Backend Ledger Team
            </p>
        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}
module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
    sendPasswordResetEmail
};