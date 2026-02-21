import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const BRIVO_API_KEY = process.env.BRIVO_API_KEY || '';

  try {
    // STEP 1: LOGIN (Handshake)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      cache: 'no-store', // Always get a fresh token to avoid 59-second expiration
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

    if (!tokenResponse.ok) return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);

    // STEP 2: FETCH USERS (The Daily Sync)
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      // Tell Vercel to cache this list for 86,400 seconds (24 hours)
      next: { revalidate: 86400 }, 
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY.trim()
      }
    });

    if (!residentsResponse.ok) return NextResponse.json([{ id: "err", firstName: "Access", lastName: "Denied" }]);

    const data = await residentsResponse.json();
    
    const rawList = data.users || data.data || data.results || [];
    
    // 🛑 THE TWEAK: First Initial, Full Last Name
    const residents = rawList.map((u: any) => ({
      id: u.id || Math.random().toString(),
      // Grabs the 1st character of the first name and adds a period (e.g., "J.")
      firstName: u.firstName ? `${u.firstName.charAt(0)}.` : "",
      // Keeps the full last name (e.g., "Smith")
      lastName: u.lastName || "",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Crash" }]);
  }
}
