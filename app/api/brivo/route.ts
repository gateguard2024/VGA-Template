import { NextResponse } from 'next/server';

// This line tells Vercel: "DO NOT CACHE THIS. RUN IT FRESH EVERY TIME."
export const dynamic = 'force-dynamic';

export async function GET() {
  // This will show up in your logs so we know the server is actually working
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
    
    // 1. Authenticate with Brivo
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

    const tokenData = await tokenResponse.json();
    console.log("Token Status:", tokenResponse.status);

    // 2. Fetch the Users
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || ''
      }
    });

    const data = await residentsResponse.json();
    console.log("Users Found:", data?.users?.length || 0);

    // 3. Return the names to your phone
    const list = data.users || [];
    return NextResponse.json(list.map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    })));

  } catch (error: any) {
    console.error("CRITICAL ERROR:", error.message);
    return NextResponse.json({ error: "Sync Failed" });
  }
}
