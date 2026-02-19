import { NextResponse } from 'next/server';
const SDK = require('@ringcentral/sdk').SDK;

const rcsdk = new SDK({
    server: 'https://platform.ringcentral.com',
    clientId: process.env.RC_CLIENT_ID,
    clientSecret: process.env.RC_CLIENT_SECRET
});

const platform = rcsdk.platform();

export async function POST(req: Request) {
    try {
        const { residentPhone } = await req.json();

        // 1. Authenticate using the JWT
        await platform.login({ jwt: process.env.RC_JWT_TOKEN });

        // 2. Initiate RingOut
        // 'from' is your gate line, 'to' is the resident
        // 'callerId' ensures both parties see the office number
        await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: process.env.RC_USERNAME }, 
            to: { phoneNumber: residentPhone }, 
            callerId: { phoneNumber: process.env.RC_USERNAME },
            playPrompt: false
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("RC Error:", error.message);
        return NextResponse.json({ error: 'Privacy Bridge Offline' }, { status: 500 });
    }
}
