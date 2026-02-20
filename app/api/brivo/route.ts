import { NextResponse } from 'next/server';

export async function GET() {
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY,
    BRIVO_USERNAME,
    BRIVO_PASSWORD
  } = process.env;

  const ACCOUNT_ID = "75828250"; // Your specific Eagles Landing Account

  try {
    // 1. Authenticate using the Password Grant Type
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
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
    if (!tokenData.access_token) throw new Error("Brivo Auth Failed");

    // 2. Fetch Users specifically for your Account ID
    // We add pageSize=100 to make sure we catch everyone
    const residentsResponse = await fetch(`https://api.brivo.com/v1/api/users?pageSize=100`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || '',
        // Some Brivo API versions require the account ID in the header
        'x-brivo-account-id': ACCOUNT_ID 
      }
    });

    const data = await residentsResponse.json();
    
    // --- DIAGNOSTIC LOG: CHECK YOUR VERCEL LOGS FOR THIS ---
    console.log("DEBUG - Brivo Data Received:", JSON.stringify(data));

    // Handle nested or flat data structures
    const userList = data.users || data.data || (Array.isArray(data) ? data : []);

    // 3. Map Brivo's 'Adams, Cheryl' format to our UI
    const residents = userList.map((u: any) => ({
      id: u.id || Math.random().toString(),
      // We force a fallback name if fields are missing
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || u.phone || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error("Brivo Sync Error:", error.message);
    return NextResponse.json([]); 
  }
}
