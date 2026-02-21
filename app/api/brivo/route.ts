import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const BRIVO_API_KEY = process.env.BRIVO_API_KEY || '';

  try {
    // STEP 1: LOGIN (Working perfectly!)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': 'Basic M2ZkMTU2MTYtMTEwOS00NWM3LTlhM2EtZTFiOGJkZGFhMDY0OndNd1hrNDZ6d1c3MHc4bTlQRFJSMTVBNmNzU09lMWN5', 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*'
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: 'rfeldman-dAsYc', 
        password: 'Gateguard123$' 
      }).toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    // STEP 2: FETCH USERS (The 403 Error)
    // Removed the extra '/api/' from the URL path just in case
    const residentsResponse = await fetch('https://api.brivo.com/v1/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY.trim()
      }
    });

    // IF IT FAILS, PRINT THE EXACT REASON TO VERCEL LOGS
    if (!residentsResponse.ok) {
      const errorText = await residentsResponse.text();
      console.error('--- 403 DATA FETCH FAILED ---');
      console.error('Status:', residentsResponse.status);
      console.error('Sent API Key:', BRIVO_API_KEY ? 'Yes (Hidden)' : 'MISSING!');
      console.error('Brivo Reason:', errorText);
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
