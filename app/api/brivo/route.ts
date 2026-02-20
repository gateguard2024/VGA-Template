import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Pulling every single credential from the secure Vercel vault
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY,
    BRIVO_USERNAME,
    BRIVO_PASSWORD,
    BRIVO_ADMIN_ID // We added this for scalability
  } = process.env;

  try {
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    // 1. Authenticate using Password Grant
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: BRIVO_USERNAME || '',
        password: BRIVO_PASSWORD || ''
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("BRIVO_AUTH_FAILED: " + tokenResponse.status + " - " + errorText);
      return NextResponse.json({ error: "Authentication Failed" }, { status: 401 });
    }

    const tokenData = await tokenResponse.json();

    // 2. Fetch Residents using the Scalable Admin ID
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || '',
        'x-brivo-admin-id': BRIVO_ADMIN_ID || '' // Scalable ID
      }
    });

    const data = await residentsResponse.json();
    const list = data.users || [];

    // 3. Map to your high-end directory UI format
    return NextResponse.json(list.map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    })));

  } catch (error: any) {
    console.error("BRIDGE_CRASH:", error.message);
    return NextResponse.json({ error: "System Connection Error" }, { status: 500 });
  }
}
