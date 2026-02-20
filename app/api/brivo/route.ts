import { NextResponse } from 'next/server';

export async function GET() {
  // Pulling your new Brivo keys from Vercel Environment Variables
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_API_KEY 
  } = process.env;

  // TEST DATA: This only shows if your keys are missing or Brivo is down
  const dummyResidents = [
    { id: "test-1", firstName: "James", lastName: "Smith", phoneNumber: "+17705256055" },
    { id: "test-2", firstName: "Sarah", lastName: "Simmons", phoneNumber: "+17705256055" },
    { id: "test-3", firstName: "Robert", lastName: "Stevens", phoneNumber: "+17705256055" }
  ];

  // If you haven't added the keys to Vercel yet, return dummy data to keep testing the UI
  if (!BRIVO_CLIENT_ID || !BRIVO_CLIENT_SECRET || !BRIVO_API_KEY) {
    console.log("Brivo credentials not found. Using dummy data.");
    return NextResponse.json(dummyResidents);
  }

  try {
    // STEP 1: Exchange Client ID/Secret for a Bearer Token (3-Legged Auth)
    const authHeader = Buffer.from(`${BRIVO_CLIENT_ID}:${BRIVO_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token?grant_type=client_credentials', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!tokenResponse.ok) throw new Error('Brivo Authentication Failed');
    
    const { access_token } = await tokenResponse.json();

    // STEP 2: Use the token to fetch real residents from Brivo
    const residentsResponse = await fetch('https://api.brivo.com/v1/api/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'api-key': BRIVO_API_KEY
      }
    });

    if (!residentsResponse.ok) throw new Error('Failed to fetch Brivo users');

    const data = await residentsResponse.json();
    
    // STEP 3: Map Brivo's data to fit our Directory's "Perfect World" UI
    const residents = data.users.map((u: any) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      // Grabs the first phone number listed in Brivo
      phoneNumber: u.phoneNumbers?.[0]?.number || "" 
    }));

    return NextResponse.json(residents);

  } catch (error: any) {
    console.error("Brivo Bridge Error:", error.message);
    // Fallback to dummy data so the app doesn't crash on the visitor
    return NextResponse.json(dummyResidents);
  }
}
