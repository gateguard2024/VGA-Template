import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // We still need the API Key from Vercel for the second step
  const BRIVO_API_KEY = process.env.BRIVO_API_KEY || '';

  try {
    // STEP 1: LOGIN (The Handshake)
    // We are HARDCODING the exact Base64 string and credentials from your successful Postman trace!
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        // This is the EXACT string from your Postman logs
        'Authorization': 'Basic M2ZkMTU2MTYtMTEwOS00NWM3LTlhM2EtZTFiOGJkZGFhMDY0OndNd1hrNDZ6d1c3MHc4bTlQRFJSMTVBNmNzU09lMWN5', 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*'
      },
      // Using the exact case-sensitive strings from your Postman body
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: 'rfeldman-dAsYc', 
        password: 'Gateguard123$' 
      }).toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Brivo Login Failed:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    // STEP 2: FETCH USERS (The Data Request)
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY.trim()
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
