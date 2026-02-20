import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("--- STARTING LIVE BRIVO SYNC ---");

  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY,
    BRIVO_USERNAME,
    BRIVO_PASSWORD 
  } = process.env;

  try {
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    // Attempting login with the standard Brivo OAuth endpoint
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

    // If the login fails (401), we stop and show a clear error in the logs
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("BRIVO_AUTH_FAILED: Status " + tokenResponse.status);
      return NextResponse.json({ error: "Check Brivo Credentials in Vercel" }, { status: 401 });
    }

    const tokenData = await tokenResponse.json();
    console.log("Token Status: Success (200)");

    // Fetch the actual Users
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || ''
      }
    });

    const data = await residentsResponse.json();
    const list = data.users || [];

    return NextResponse.json(list.map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    })));

  } catch (error: any) {
    console.error("BRIDGE_CRASH:", error.message);
    return NextResponse.json({ error: "Connection Error" }, { status: 500 });
  }
}
