import { NextResponse } from 'next/server';

export async function GET() {
  console.log("--- API_ACCESSED_AT: " + new Date().toISOString() + " ---"); // This MUST show in logs

  const { BRIVO_CLIENT_ID, BRIVO_CLIENT_SECRET, BRIVO_API_KEY, BRIVO_USERNAME, BRIVO_PASSWORD } = process.env;

  // If even ONE key is missing, we stop here and tell you in the logs
  if (!BRIVO_CLIENT_ID || !BRIVO_CLIENT_SECRET || !BRIVO_USERNAME) {
    console.error("LOGS: Missing Environment Variables in Vercel Dashboard");
    return NextResponse.json([{ id: "err", lastName: "Check Vercel Keys", firstName: "System" }]);
  }

  try {
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: BRIVO_USERNAME,
        password: BRIVO_PASSWORD
      })
    });

    const tokenData = await tokenResponse.json();
    console.log("LOGS: Brivo Token Received Status:", tokenResponse.status);

    const res = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'api-key': BRIVO_API_KEY || ''
      }
    });

    const data = await res.json();
    const list = data.users || [];
    
    console.log("LOGS: Users Found Count:", list.length);
    return NextResponse.json(list);

  } catch (error: any) {
    console.error("LOGS: CRITICAL_BRIDGE_ERROR:", error.message);
    return NextResponse.json([{ id: "err", lastName: "Brivo Sync Failed", firstName: "System" }]);
  }
}
