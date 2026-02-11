import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process. env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return new NextResponse(
                `<! DOCTYPE html>
                <html>
                <head><title>Unsubscribe Error</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>Invalid unsubscribe link</h1>
                    <p>Please use the link from your newsletter email. </p>
                </body>
                </html>`,
                { headers: { 'Content-Type':  'text/html' } }
            );
        }

        // Update subscriber status
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ 
                is_active: false,
                unsubscribed_at: new Date().toISOString()
            })
            .eq('unsubscribe_token', token);

        if (error) {
            throw error;
        }

        return new NextResponse(
            `<!DOCTYPE html>
            <html>
            <head>
                <title>Unsubscribed</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 50px; background: #000; color: #fff; }
                    .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
                    h1 { color: #46b94e; }
                    a { color: #46b94e; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✓ Successfully Unsubscribed</h1>
                    <p>You've been unsubscribed from our newsletter.</p>
                    <p>We're sorry to see you go! If you change your mind, you can always subscribe again from our blog page.</p>
                    <p style="margin-top: 40px;"><a href="${process.env. NEXT_PUBLIC_SITE_URL}/pages/blog">← Back to Blog</a></p>
                </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return new NextResponse(
            `<!DOCTYPE html>
            <html>
            <head><title>Error</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1>Error</h1>
                <p>Something went wrong. Please try again later.</p>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }
}