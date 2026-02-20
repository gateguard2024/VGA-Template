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
      const errorData = await tokenResponse.json();
      console.error("Brivo Auth Failed:", errorData);
      throw new Error("Invalid Brivo Credentials");
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch the User Directory for Elevate Eagles Landing
    // We fetch up to 100 users to ensure the directory is populated
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users?pageSize=100', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'api-key': BRIVO_API_KEY || ''
      }
    });

    const data = await residentsResponse.json();
    const userList = data.users || [];

    // 3. Map Brivo data to our UI format
    const residents = userList.map((u: any) => ({
      id: u.id,
      firstName: u.firstName || "",
      lastName: u.lastName || "Resident",
      phoneNumber: u.phoneNumbers?.[0]?.number || "" // Grabs primary phone
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error("Brivo Bridge Error:", error.message);
    // Return an empty array so the directory doesn't crash
    return NextResponse.json([]);
  }
}
