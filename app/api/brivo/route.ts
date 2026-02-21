import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const BRIVO_API_KEY = process.env.BRIVO_API_KEY || '';

  try {
    // STEP 1: LOGIN
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      cache: 'no-store',
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

    // STEP 2: FETCH USERS
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      cache: 'no-store',
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY.trim()
      }
    });

    if (!residentsResponse.ok) {
      return NextResponse.json([{ id: "err", firstName: "Access", lastName: "Denied" }]);
    }

    const data = await residentsResponse.json();
    
    // 🛑 DEBUGGING: Let's see exactly what Brivo sent us!
    console.log('--- BRIVO DATA STRUCTURE ---');
    console.log('Keys found in response:', Object.keys(data));
    
    // We will try looking in 'data' instead of 'users' as a fallback
    const rawList = data.users || data.data || data.results || [];
    
    if (rawList.length > 0) {
      console.log('First resident found looks like:', rawList[0]);
    } else {
      console.log('The list is still completely empty!');
    }

    // Map the users to your directory format
    const residents = rawList.map((u: any) => ({
      id: u.id || Math.random().toString(),
      firstName: u.firstName || "Unknown",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error('Code Crash:', error);
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Crash" }]);
  }
}
