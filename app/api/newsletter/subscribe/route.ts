import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL! ,
    process.env. SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request:  Request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || ! email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const { data:  existing } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('email', email)
            .single();

        if (existing) {
            if (existing.is_active && existing.confirmed) {
                return NextResponse.json(
                    { error: 'This email is already subscribed!' },
                    { status: 400 }
                );
            } else if (existing.is_active && !existing.confirmed) {
                // Resend confirmation
                await sendConfirmationEmail(email, existing.unsubscribe_token);
                return NextResponse.json({
                    message: 'Confirmation email resent!  Please check your inbox.',
                });
            }
        }

        // Insert new subscriber
        const { data: newSubscriber, error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email,
                is_active: true,
                confirmed: false,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to subscribe.  Please try again.' },
                { status: 500 }
            );
        }

        // Send confirmation email
        await sendConfirmationEmail(email, newSubscriber.unsubscribe_token);

        return NextResponse.json({
            message: 'Success! Please check your email to confirm your subscription.',
        });

    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function sendConfirmationEmail(email:  string, token: string) {
    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter/confirm? token=${token}`;
    
    try {
        await resend.emails.send({
            from: `${process.env.NEWSLETTER_FROM_NAME || 'GFG SRMIST'} <${process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@gfgsrmist.com'}>`,
            to: email,
            subject: 'Confirm Your Newsletter Subscription',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin:  0 auto; padding: 20px; }
                        . header { background: linear-gradient(135deg, #46b94e 0%, #2f8d46 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: #46b94e; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin:  20px 0; }
                        .button:hover { background: #3a9a40; }
                        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to GFG SRMIST!</h1>
                        </div>
                        <div class="content">
                            <h2>Confirm Your Subscription</h2>
                            <p>Thank you for subscribing to our newsletter!  You'll receive weekly updates with our latest blog posts, events, and tech insights.</p>
                            <p>Please click the button below to confirm your email address:</p>
                            <div style="text-align: center;">
                                <a href="${confirmUrl}" class="button">Confirm Subscription</a>
                            </div>
                            <p style="color: #666; font-size:  14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                            <p style="color: #46b94e; font-size:  12px; word-break: break-all;">${confirmUrl}</p>
                            <p style="margin-top: 30px; color: #999; font-size: 13px;">If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} GeeksForGeeks SRMIST NCR.  All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        throw error;
    }
}