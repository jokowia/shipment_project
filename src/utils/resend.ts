import nodemailer from 'nodemailer';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendClientEmail({ to, subject, html }: SendEmailParams) {
    const isResendSmtp = !!process.env.RESEND_API_KEY && !process.env.SMTP_HOST;
    const smtpHost = process.env.SMTP_HOST || (isResendSmtp ? 'smtp.resend.com' : '');
    const smtpPort = parseInt(process.env.SMTP_PORT || (isResendSmtp ? '465' : '0'), 10);
    const smtpUser = process.env.SMTP_USER || (isResendSmtp ? 'resend' : '');
    const smtpPass = process.env.SMTP_PASSWORD || process.env.RESEND_API_KEY || '';

    // The "from" address needs to use the verified domain
    const fromAddress = process.env.SMTP_FROM_EMAIL || 'DHL Express <dhl@myshipment.delivery>';

    if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn("SMTP credentials (or RESEND_API_KEY) are missing. Email simulated:", { to, subject, from: fromAddress });
        return { success: true, simulated: true };
    }

    if (fromAddress.includes('yourdomain.com')) {
        console.warn("⚠️ IMPORTANT: Please add SMTP_FROM_EMAIL=\"DHL Express <support@myshipment.delivery>\" to your .env.local file to use your verified Resend domain.");
    }

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const info = await transporter.sendMail({
            from: fromAddress,
            replyTo: fromAddress,
            to: to,
            subject: subject,
            html: html,
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true, data: info };
    } catch (e) {
        console.error('Failed to send email via SMTP:', e);
        return { success: false, error: e };
    }
}
