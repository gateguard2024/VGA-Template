import { NextResponse } from 'next/server';
const SDK = require('@ringcentral/sdk').SDK;

export async function POST(req: Request) {
    try {
        const { residentPhone } = await req.json();

        // 1. Initialize SDK inside the request to ensure clean state
        const rcsdk = new SDK({
            server: 'https://platform.ringcentral.com',
            clientId: process.env.RC_CLIENT_ID,
            clientSecret: process.env.RC_CLIENT_SECRET
        });

        const platform = rcsdk.platform();

        // 2. Authenticate using your Master JWT
        await platform.login({ jwt: process.env.RC_JWT_TOKEN });

        // 3. The "Perfect World" RingOut Bridge
        // 'from' = Your Gate Line | 'to' = Resident | 'callerId' = Your Gate Line
        const response = await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: process.env.RC_USERNAME }, 
            to: { phoneNumber: residentPhone }, 
            callerId: { phoneNumber: process.env.RC_USERNAME },
            playPrompt: false
        });

        return NextResponse.json({ success: true, status: 'Call Initiated' });

    } catch (error: any) {
        console.error("RingCentral Error:", error.message);
        return NextResponse.json({ 
            error: 'Privacy Bridge Offline', 
            details: error.message 
        }, { status: 500 });
    }
}
