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
    // Encode Client ID and Secret for Basic Authentication
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    // 1. Get Token (HANDSHAKE)
    // Per Brivo instructions: Use Admin ID as the 'username' field
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: BRIVO_ADMIN_ID || '', 
        password: BRIVO_PASSWORD || '' 
      })
    });

    const tokenData = await tokenResponse.json();

    // Check if the handshake failed before proceeding
    if (!tokenResponse.ok) {
      console.error('Brivo Auth Failed:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Auth", lastName: "Failed" }]);
    }

    // 2. Fetch Residents (DATA REQUEST)
    // Per Brivo instructions: Use 'bearer' (lowercase) and include 'api-key'
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || ''
      }
    });

    // 3. HANDLE ERRORS OR PERMISSION DENIED
    if (!residentsResponse.ok) {
      console.error(`BRIVO_API_ERROR: ${residentsResponse.status}`);
      return NextResponse.json([{ 
        id: "err", 
        firstName: "Access", 
        lastName: "Denied-by-Brivo" 
      }]);
    }

    const data = await residentsResponse.json();
    const list = data.users || [];
    
    // 4. Clean Mapping for the Directory
    const residents = list.map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error("BRIDGE_CRASH:", error.message);
    return NextResponse.json([{ 
      id: "err", 
      firstName: "System", 
      lastName: "Sync-Error" 
    }]);
  }
}
