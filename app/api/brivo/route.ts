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
    // FIX: authHeader must be defined before use to prevent build errors
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    // 1. Initial Handshake (OAuth Token)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: BRIVO_ADMIN_ID || '', // PER INSTRUCTIONS: Use Admin ID
        password: BRIVO_PASSWORD || '' 
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Brivo Login Rejected:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    // 2. Fetch Residents
    // PER INSTRUCTIONS: Use 'bearer' (lowercase) and 'api-key' header
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || ''
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
