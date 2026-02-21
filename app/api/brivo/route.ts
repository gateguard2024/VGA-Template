import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY, 
    BRIVO_PASSWORD, 
    BRIVO_ADMIN_ID 
  } = process.env;

  try {
    // Basic Auth Header using your confirmed Client ID and Secret
    const credentials = `${BRIVO_CLIENT_ID?.trim()}:${BRIVO_CLIENT_SECRET?.trim()}`;
    const authHeader = Buffer.from(credentials).toString('base64');
    
    // STEP 1: LOGIN (The Handshake)
    // Matches your successful Postman Body configuration
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: String(BRIVO_ADMIN_ID || '').trim(), 
        password: String(BRIVO_PASSWORD || '').trim() 
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Brivo Login Rejected:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    // STEP 2: GET USERS (The Data Request)
    // Uses the 'bearer' token and 'api-key' header from Brivo instructions
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': String(BRIVO_API_KEY || '').trim()
      }
    });

    if (!residentsResponse.ok) {
      return NextResponse.json([{ id: "err", firstName: "Access", lastName: "Denied" }]);
    }

    const data = await residentsResponse.json();
    
    const residents = (data.users || []).map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Error" }]);
  }
}
