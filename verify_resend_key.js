import nodemailer from 'nodemailer';

async function verify() {
    console.log('Testing Resend API Key...');

    const transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
            user: 'resend',
            pass: 're_c9gs66Ed_3yC3hgAMEAsdmRHEKuhfk1bJ' // User provided key
        }
    });

    try {
        await transporter.verify();
        console.log('✅ Success! The Resend API Key is valid.');
        console.log('You can now safely use this in Render.');
    } catch (err) {
        console.error('❌ Failed:', err.message);
    }
}

verify();
