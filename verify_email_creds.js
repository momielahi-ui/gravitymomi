import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log('--- Testing Email Configuration ---');

    const sender = process.env.SENDER_EMAIL || process.env.PAYONEER_EMAIL;
    const password = process.env.EMAIL_PASSWORD;

    if (!sender) {
        console.error('❌ Error: SENDER_EMAIL (or PAYONEER_EMAIL) is not set in .env');
        process.exit(1);
    }
    if (!password) {
        console.error('❌ Error: EMAIL_PASSWORD is not set in .env');
        process.exit(1);
    }

    console.log(`Using Sender: ${sender}`);
    console.log(`Using Password: ${password.slice(0, 3)}... (masked)`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender,
            pass: password
        }
    });

    try {
        console.log('Attempting to verify connection...');
        await transporter.verify();
        console.log('✅ Connection Successful! Credentials are correct.');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Test Script" <${sender}>`,
            to: sender, // Send to self
            subject: 'SmartReception Email Test',
            text: 'If you are reading this, your email configuration is working perfectly!'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox (and spam folder) for a message from yourself.');
    } catch (error) {
        console.error('❌ Connection/Send Failed:');
        console.error(error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Tip: This usually means the App Password is wrong or missing.');
            console.log('Make sure you are NOT using your regular Gmail password.');
            console.log('Generate an App Password here: https://myaccount.google.com/apppasswords');
        }
    }
}

main();
