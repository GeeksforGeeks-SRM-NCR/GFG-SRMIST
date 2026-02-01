import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request. url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/pages/blog? error=invalid_token`
            );
        }

        // Find subscriber by token
        const { data: subscriber, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('unsubscribe_token', token)
            .single();

        if (error || !subscriber) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/pages/blog?error=invalid_token`
            );
        }

        // Update to confirmed
        await supabase
            .from('newsletter_subscribers')
            .update({ 
                confirmed: true, 
                is_active: true,
                confirmed_at: new Date().toISOString()
            })
            .eq('unsubscribe_token', token);

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/pages/blog?confirmed=true`
        );

    } catch (error) {
        console.error('Confirmation error:', error);
        return NextResponse. redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/pages/blog? error=server_error`
        );
    }
}