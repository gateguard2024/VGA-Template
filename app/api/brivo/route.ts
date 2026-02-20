import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper to get new access token using the 20-year refresh token
async function getRefreshedToken(refreshToken: string, authHeader: string) {
  const response = await fetch('https://auth.brivo.com/oauth/token', {
    method: 'POST',
    headers: { 
      'Authorization': `Basic ${authHeader}`, 
      'Content-Type': 'application/x-www-form-urlencoded' 
    },
    body: new URLSearchParams({ 
      grant_type: 'refresh_token', 
      refresh_token: refreshToken 
    })
  });
  return await response.json();
}

export async function GET() {
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY, 
    BRIVO_PASSWORD, 
    BRIVO_ADMIN_ID // This is your "Username" per Brivo's instructions
  } = process.env;

  try {
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    // 1. Get Token (Initial Handshake using Admin ID)
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: BRIVO_ADMIN_ID || '', // PER INSTRUCTIONS: Use Admin ID here
        password: BRIVO_PASSWORD || '' 
      })
    });

    const tokenData = await tokenResponse.json();
    
    // 2. Fetch Residents using the Bearer token
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `bearer ${tokenData.access_token}`, // Case-sensitive "bearer"
        'api-key': BRIVO_API_KEY || ''
      }
    });

    if (!residentsResponse.ok) {
      return NextResponse.json([{ id: "err", firstName: "Access", lastName: "Denied-by-Brivo" }]);
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
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Sync-Error" }]);
  }
}
