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
      'Shipment Update: Delivery Information Required', 
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
                            <img src="https://myshipment.delivery/dhllogonobg.svg" alt="DHL Logo" height="24" style="display: block; width: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin-top: 0; font-size: 22px; font-weight: normal;">Shipment Status Update</h2>
                            <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 20px;">Dear {{full_name}},</p>
                            <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 20px;">We are currently processing a shipment scheduled for delivery to your address. To ensure a smooth delivery process, kindly verify your delivery preferences and complete the pending processing step.</p>
                            
                            <!-- Tracking Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 4px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #555555; font-size: 13px; letter-spacing: 0.5px;">Waybill Number</p>
                                        <p style="margin: 5px 0 0 0; color: #d40511; font-size: 18px; font-weight: bold;">{{tracking_number}}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action Button -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center" style="border-radius: 4px;" bgcolor="#d40511">
                                        <a href="https://myshipment.delivery/track?token={{raw_token}}" target="_blank" style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 12px 24px; border: 1px solid #d40511; display: inline-block;">Manage Shipment</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #555555; font-size: 14px; line-height: 22px; margin: 0;">Kind regards,<br/><strong>The DHL Team</strong></p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="color: #555555; font-size: 12px; margin: 0;">&copy; 2026 DHL International GmbH. All rights reserved.</p>
                            <p style="color: #555555; font-size: 11px; margin: 10px 0 0 0; line-height: 16px;">This message is sent from an unmonitored address. Please do not reply.</p>
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
