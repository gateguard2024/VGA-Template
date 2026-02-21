import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { 
    BRIVO_BASIC_AUTH, // Pulling the perfect string from Postman
    BRIVO_API_KEY, 
    BRIVO_PASSWORD, 
    BRIVO_ADMIN_ID 
  } = process.env;

  try {
    if (!BRIVO_BASIC_AUTH) {
      console.error('Missing BRIVO_BASIC_AUTH in Vercel Variables!');
      return NextResponse.json([{ id: "err", firstName: "Setup", lastName: "Missing-Auth" }]);
    }

    // STEP 1: LOGIN (Using Postman's exact Base64 string)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${BRIVO_BASIC_AUTH.trim()}`, 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      // .toString() forces Vercel to format this exactly like Postman's x-www-form-urlencoded
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: String(BRIVO_ADMIN_ID || '').trim(), 
        password: String(BRIVO_PASSWORD || '').trim() 
      }).toString() 
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Brivo Login Failed:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    // STEP 2: FETCH USERS
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
    console.error('Code Crash:', error);
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Crash" }]);
  }
}
