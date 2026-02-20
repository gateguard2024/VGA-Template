import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Pull the variables from your Vercel Environment Settings
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY, 
    BRIVO_PASSWORD, 
    BRIVO_ADMIN_ID 
  } = process.env;

  try {
    // 2. Create the "Basic" Authorization string
    // This encodes "ID:Secret" into a format like "Basic dXNlcm5hbWU6cGFzc3dvcmQ="
    const authCredentials = `${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`;
    const encodedAuth = Buffer.from(authCredentials).toString('base64');

    // 3. STEP 1: Get the Token (The Handshake)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${encodedAuth}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: BRIVO_ADMIN_ID || '', // Make sure this is the ADMIN ID from the circle badge
        password: BRIVO_PASSWORD || '' 
      })
    });

    const tokenData = await tokenResponse.json();

    // Check if Step 1 failed
    if (!tokenResponse.ok) {
      console.error('Brivo Auth Failed:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Auth", lastName: "Failed" }]);
    }

    // 4. STEP 2: Fetch the Users (The Data)
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`, // Bearer must be lowercase or standard
        'api-key': BRIVO_API_KEY || ''
      }
    });

    const data = await residentsResponse.json();

    if (!residentsResponse.ok) {
      console.error('Brivo Data Fetch Failed:', data);
      return NextResponse.json([{ id: "err", firstName: "API", lastName: "Denied" }]);
    }

    // 5. Clean and return the data to your frontend
    const residents = (data.users || []).map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error('System Error:', error);
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Error" }]);
  }
}
