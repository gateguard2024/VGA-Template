import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY, 
    BRIVO_USERNAME, 
    BRIVO_PASSWORD, 
    BRIVO_ADMIN_ID 
  } = process.env;

  try {
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    // 1. Get Token (HANDSHAKE)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: BRIVO_USERNAME || '', 
        password: BRIVO_PASSWORD || '' 
      })
    });

    const tokenData = await tokenResponse.json();

    // 2. Fetch Residents (DATA REQUEST)
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || '',
        'x-brivo-admin-id': BRIVO_ADMIN_ID || ''
      }
    });

    // 3. HANDLE PERMISSION DENIED (403 ERROR)
    if (!residentsResponse.ok) {
      console.error(`BRIVO_ERROR: ${residentsResponse.status}`);
      
      // If Brivo blocks the list, show this clear message in the app search
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
