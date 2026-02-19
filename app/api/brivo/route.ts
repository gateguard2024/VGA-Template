import { NextResponse } from 'next/server';

export async function GET() {
  const CLIENT_ID = process.env.BRIVO_CLIENT_ID;
  const CLIENT_SECRET = process.env.BRIVO_CLIENT_SECRET;

  try {
    // 1. Get Access Token from Brivo
    const authResponse = await fetch('https://auth.brivo.com/oauth/token?grant_type=client_credentials', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = await authResponse.json();

    // 2. Fetch Users from Brivo
    // NOTE: You'll need to update this URL with your specific Brivo Account ID later
    const userResponse = await fetch('https://api.brivo.com/v1/api/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'api-key': process.env.BRIVO_API_KEY || '' 
      }
    });

    const data = await userResponse.json();

    // 3. Return the data to our app
    return NextResponse.json(data.data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
  }
}
