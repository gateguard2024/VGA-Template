import { NextResponse } from 'next/server';

export async function GET() {
  const CLIENT_ID = process.env.BRIVO_CLIENT_ID;
  const CLIENT_SECRET = process.env.BRIVO_CLIENT_SECRET;
  const ACCOUNT_ID = "75828250"; // Your Brivo ID (API)

  try {
    // 1. Get Access Token
    const authResponse = await fetch('https://auth.brivo.com/oauth/token?grant_type=client_credentials', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = await authResponse.json();

    // 2. Fetch Users specifically for your Account ID
    const userResponse = await fetch(`https://api.brivo.com/v1/api/accounts/${ACCOUNT_ID}/users`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'api-key': process.env.BRIVO_API_KEY || ''
      }
    });

    const data = await userResponse.json();
    return NextResponse.json(data.data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
  }
}
