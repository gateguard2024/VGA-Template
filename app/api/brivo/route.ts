import { NextResponse } from 'next/server';

// This tells Vercel not to cache this API call
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
    // 1. Create the Basic Auth Header (Base64 encoding ID and Secret)
    const credentials = `${BRIVO_CLIENT_ID?.trim()}:${BRIVO_CLIENT_SECRET?.trim()}`;
    const authHeader = Buffer.from(credentials).toString('base64');
    
    // STEP 1: LOGIN (The Handshake)
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

    // If this part fails, we stop and log the error
    if (!tokenResponse.ok) {
      console.error('--- DEBUG BRIVO LOGIN ---');
      console.error('Brivo Response:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    // STEP 2: GET USERS (The Data Request)
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`, // Lowercase 'bearer' per instructions
        'api-key': String(BRIVO_API_KEY || '').trim()
      }
    });

    if (!residentsResponse.ok) {
      return NextResponse.json([{ id: "err", firstName: "Access", lastName: "Denied" }]);
    }

    const data = await residentsResponse.json();
    
    // Map the Brivo data format to what your Directory UI expects
    const residents = (data.users || []).map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error('CRITICAL SYSTEM ERROR:', error);
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Error" }]);
  }
}
