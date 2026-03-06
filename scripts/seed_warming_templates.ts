import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("Missing SUPABASE URL or KEY");
    process.exit(1);
}

const supabase = createClient(url, key);

const templates = [
    {
        name: 'Warming Template 1 - System Check',
        subject: 'Testing our new tracking links',
        body_html: `<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
<p>Hello {{full_name}},</p>
<p>I'm sending over a quick message to test out our new shipment tracking system. We are currently configuring the backend to work smoothly with our carrier partners, including DHL.</p>
<p>Could you let me know if you received this message clearly? Also, if you have a moment, I'd love it if you could click over to <a href="https://myshipment.delivery/track?token={{raw_token}}">https://myshipment.delivery</a> and see if the page loads correctly for you.</p>
<p>Just a quick reply to this email would be a huge help.</p>
<p>Thanks for helping us test this out,</p>
<p>MyShipment Delivery<br>
support@myshipment.delivery</p>
</div>`
    },
    {
        name: 'Warming Template 2 - Portal Run-through',
        subject: 'Quick check on the delivery portal',
        body_html: `<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
<p>Hello {{full_name}},</p>
<p>We are currently doing some test runs on our notification system to make sure all future delivery updates arrive right on time.</p>
<p>If you don't mind, could you shoot me a quick reply just to confirm this landed in your primary inbox? You can also check out our main site at <a href="https://myshipment.delivery/track?token={{raw_token}}">https://myshipment.delivery</a> to see what we're working on.</p>
<p>Let me know what you think when you have a chance.</p>
<p>Best regards,</p>
<p>MyShipment Delivery<br>
support@myshipment.delivery</p>
</div>`
    },
    {
        name: 'Warming Template 3 - Early Feedback',
        subject: 'Looking for your thoughts on the new shipment tool',
        body_html: `<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
<p>Hello {{full_name}},</p>
<p>We're putting the finishing touches on our delivery tracking dashboard and are reaching out to a few folks for some early feedback.</p>
<p>To make sure our incoming carrier data (like our DHL setup) is firing correctly, we're sending out these test messages. If it's not too much trouble, please head over to <a href="https://myshipment.delivery/track?token={{raw_token}}">https://myshipment.delivery</a> and take a quick look around.</p>
<p>Drop a reply whenever you can to let me know if everything looks good on your end.</p>
<p>Appreciate your time,</p>
<p>MyShipment Delivery<br>
support@myshipment.delivery</p>
</div>`
    },
    {
        name: 'Warming Template 4 - Infrastructure Update',
        subject: 'Our logistics system update',
        body_html: `<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
<p>Hello {{full_name}},</p>
<p>I wanted to share a quick update on our end. We are upgrading the communications side of our logistics platform so our shipment updates can flow faster.</p>
<p>I would appreciate it if you could reply to this note so I can be sure our routing is set up properly. Also, feel free to visit <a href="https://myshipment.delivery/track?token={{raw_token}}">https://myshipment.delivery</a> just to make sure the connection is solid and loads fast on your device.</p>
<p>Thanks for lending a hand with this test run.</p>
<p>Warmly,</p>
<p>MyShipment Delivery<br>
support@myshipment.delivery</p>
</div>`
    },
    {
        name: 'Warming Template 5 - Beta Test',
        subject: 'Welcome to the MyShipment beta test',
        body_html: `<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
<p>Hello {{full_name}},</p>
<p>Thanks for agreeing to help us test our new early-stage package tracking system! We're making sure notifications from different couriers such as DHL flow right to your inbox without a hitch.</p>
<p>Whenever you get a second, please reply to this email so I know it reached you successfully. You're also welcome to explore the main page here: <a href="https://myshipment.delivery/track?token={{raw_token}}">https://myshipment.delivery</a>.</p>
<p>Any feedback you have is always welcome.</p>
<p>Cheers,</p>
<p>MyShipment Delivery<br>
support@myshipment.delivery</p>
</div>`
    }
];

async function run() {
    console.log("Fetching all admins...");
    const { data: admins, error: adminError } = await supabase
        .from('admins')
        .select('id');

    if (adminError) {
        console.error("Failed to fetch admins:", adminError);
        return;
    }

    if (!admins || admins.length === 0) {
        console.log("No admins found.");
        return;
    }

    console.log(`Found ${admins.length} admins. Seeding templates...`);

    for (const admin of admins) {
        for (const template of templates) {
            const { error } = await supabase
                .from('email_templates')
                .upsert({
                    admin_id: admin.id,
                    name: template.name,
                    subject: template.subject,
                    body_html: template.body_html,
                    is_default: false
                }, { onConflict: 'admin_id, name' });

            if (error) {
                console.error(`Failed to insert template '${template.name}' for admin ${admin.id}:`, error);
            } else {
                console.log(`Successfully inserted/updated template '${template.name}' for admin ${admin.id}`);
            }
        }
    }
    console.log("Done seeding templates.");
}

run();
