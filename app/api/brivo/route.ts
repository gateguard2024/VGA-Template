import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // A. Gather your secrets from Vercel
    const { BRIVO_API_KEY, BRIVO_CLIENT_ID, BRIVO_CLIENT_SECRET, BRIVO_USERNAME, BRIVO_PASSWORD } = process.env;

    // B. Step 1: Get the Access Token (The "Handshake")
    // We use the 'password' grant type as recommended for admin-level access.
    const authString = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
        'api-key': BRIVO_API_KEY as string,
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: BRIVO_USERNAME as string,
        password: BRIVO_PASSWORD as string,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error('Brivo Auth Failed');

    // C. Step 2: Fetch the Users (The "Data Grab")
    const userResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY as string,
      },
    });

    const userData = await userResponse.json();
    if (!userResponse.ok) throw new Error('Failed to fetch Brivo users');

    // D. Step 3: Sanitize for Privacy
    // We only send the minimum data needed to the browser.
    const cleanList = userData.data.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || null,
    }));

    return NextResponse.json(cleanList);

  } catch (error) {
    console.error('Brivo Bridge Error:', error);
    return NextResponse.json({ error: 'Connection Failed' }, { status: 500 });
  }
}
