import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("Missing SUPABASE URL or KEY");
    process.exit(1);
}

const supabase = createClient(url, key);

const dhlTemplateHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ffcc00; padding: 20px 30px; text-align: left;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/DHL_Express_logo.svg/2560px-DHL_Express_logo.svg.png" alt="DHL Logo" height="24" style="display: block; width: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #d40511; margin-top: 0; font-size: 24px; font-weight: bold;">Your parcel is on its way.</h2>
                            <p style="color: #333333; font-size: 16px; line-height: 24px; margin-bottom: 20px;">Dear Customer,</p>
                            <p style="color: #333333; font-size: 16px; line-height: 24px; margin-bottom: 20px;">We are currently attempting to process a package for you. To ensure successful delivery, please confirm your delivery details and cover the required processing fee.</p>
                            
                            <!-- Tracking Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Tracking Number</p>
                                        <p style="margin: 5px 0 0 0; color: #333333; font-size: 18px; font-weight: bold;">{{tracking_number}}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action Button -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center" style="border-radius: 4px;" bgcolor="#d40511">
                                        <a href="http://localhost:3000/track?token={{raw_token}}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 14px 28px; border: 1px solid #d40511; display: inline-block; font-weight: bold;">Track & Confirm Delivery</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0;">Thank you for trusting DHL,<br/><strong>DHL Express Team</strong></p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #333333; padding: 20px 30px; text-align: center;">
                            <p style="color: #cccccc; font-size: 12px; margin: 0;">&copy; 2026 DHL International GmbH. All rights reserved.</p>
                            <p style="color: #999999; font-size: 11px; margin: 10px 0 0 0; line-height: 16px;">This is an automated message, please do not reply to this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

async function run() {
    const { data, error } = await supabase
        .from('email_templates')
        .update({
            subject: 'DHL EXPRESS: Action Required for your Shipment',
            body_html: dhlTemplateHtml
        })
        .eq('is_default', true);

    if (error) {
        console.error("Failed to update templates:", error);
    } else {
        console.log("Successfully updated default templates!", data);
    }
}

run();
