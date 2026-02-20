import { NextResponse } from 'next/server';

export async function GET() {
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY,
    BRIVO_USERNAME,
    BRIVO_PASSWORD
  } = process.env;

  try {
    // 1. Authenticate using the Password Grant Type
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
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

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Brivo Auth Failed:", errorText);
      return NextResponse.json({ error: "Auth Failed", details: errorText }, { status: 401 });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch the User Directory
    // Note: We use the pageSize=100 and check the global user list first
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'api-key': BRIVO_API_KEY || ''
      }
    });

    const data = await residentsResponse.json();
    
    // --- DIAGNOSTIC LOGGING ---
    // This will appear in your Vercel 'Logs' tab. Check here if users are missing.
    console.log("BRIVO API RESPONSE:", JSON.stringify(data));

    // Handle different Brivo API response structures
    const userList = data.users || data.data || (Array.isArray(data) ? data : []);

    if (userList.length === 0) {
      console.warn("Brivo returned an empty user list. Check if users are 'Active' in Brivo.");
    }

    // 3. Map Brivo data to our UI format
    const residents = userList.map((u: any) => ({
      id: u.id || Math.random().toString(),
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      // Look for any available phone number field
      phoneNumber: u.phoneNumbers?.[0]?.number || u.phone || u.mobile || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error("Bridge Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
