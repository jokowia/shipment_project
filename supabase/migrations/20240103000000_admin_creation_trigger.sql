-- Migration: Automate Admin and Default Email Template Creation

-- Create a function to handle new user signups via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_admin() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- 1. Insert into admins table
  INSERT INTO public.admins (id, email)
  VALUES (new.id, new.email);

  -- 2. Insert a default email template for this admin
  -- This is critical so `addSingleClient` finds a template to send!
  INSERT INTO public.email_templates (admin_id, name, subject, body_html, is_default)
  VALUES (
      new.id, 
      'Default Shipment Template', 
      'DHL EXPRESS: Action Required for your Shipment', 
      '<!DOCTYPE html>
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
</html>', 
      true
  );

  RETURN new;
END;
$$;

-- Trigger the function every time a user is created in the auth schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin();
