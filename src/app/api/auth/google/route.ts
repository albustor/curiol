import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, saveGoogleTokens } from '@/lib/google-auth';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        console.error('Google OAuth Error:', error);
        return NextResponse.redirect(`${req.nextUrl.origin}/admin/dashboard?error=google_auth_failed`);
    }

    if (!code) {
        return NextResponse.redirect(`${req.nextUrl.origin}/admin/dashboard?error=no_code`);
    }

    try {
        const tokens = await getTokensFromCode(code);
        await saveGoogleTokens(tokens);

        // Redirect to admin dashboard with success
        return NextResponse.redirect(`${req.nextUrl.origin}/admin/dashboard?auth=google_success`);
    } catch (err) {
        console.error('Callback Logic Error:', err);
        return NextResponse.redirect(`${req.nextUrl.origin}/admin/dashboard?error=callback_logic_error`);
    }
}
