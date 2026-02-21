import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { 
    BRIVO_CLIENT_ID, 
    BRIVO_CLIENT_SECRET, 
    BRIVO_PASSWORD, 
    BRIVO_ADMIN_ID 
  } = process.env;

  try {
    // 1. VERIFY VARIABLES ARE ACTUALLY LOADING
    console.log('--- ENV VAR CHECK ---');
    console.log('Has Client ID?', !!BRIVO_CLIENT_ID, `(Length: ${BRIVO_CLIENT_ID?.length})`);
    console.log('Has Secret?', !!BRIVO_CLIENT_SECRET, `(Length: ${BRIVO_CLIENT_SECRET?.length})`);
    
    if (!BRIVO_CLIENT_ID || !BRIVO_CLIENT_SECRET) {
      console.error('CRITICAL: Vercel is not passing the Environment Variables to the code!');
      return NextResponse.json([{ id: "err", firstName: "Env", lastName: "Missing" }]);
    }

    // 2. GENERATE THE KEY
    const credentials = `${BRIVO_CLIENT_ID.trim()}:${BRIVO_CLIENT_SECRET.trim()}`;
    // Using btoa() which is safer across different Vercel Edge/Node runtimes
    const authHeader = btoa(credentials);
    
    console.log('Generated Auth Header: Basic', authHeader);

    // 3. ATTEMPT LOGIN
    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${authHeader}`, 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({ 
        grant_type: 'password', 
        username: String(BRIVO_ADMIN_ID || '').trim(), 
        password: String(BRIVO_PASSWORD || '').trim() 
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Brivo Login Failed:', tokenData);
      return NextResponse.json([{ id: "err", firstName: "Login", lastName: "Rejected" }]);
    }

    return NextResponse.json([{ id: "success", firstName: "Login", lastName: "Worked!" }]);

  } catch (error: any) {
    console.error('Code Crash:', error);
    return NextResponse.json([{ id: "err", firstName: "System", lastName: "Crash" }]);
  }
}
