import { NextResponse } from 'next/server';
import { SDK } from '@ringcentral/sdk';

export async function POST(req: Request) {
    try {
        const { residentPhone, visitorPhone } = await req.json();

        const rcsdk = new SDK({
            server: 'https://platform.ringcentral.com',
            clientId: process.env.RC_CLIENT_ID,
            clientSecret: process.env.RC_CLIENT_SECRET
        });

        const platform = rcsdk.platform();
        await platform.login({ jwt: process.env.RC_JWT_TOKEN });

        // THE CORRECT BRIDGE LOGIC:
        // 'from' = The visitor's physical phone number (the one they are holding)
        // 'to' = The resident's private number from Brivo
        // 'callerId' = Your Main Office Line (masks both)
        await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: visitorPhone }, 
            to: { phoneNumber: residentPhone }, 
            callerId: { phoneNumber: process.env.RC_USERNAME },
            playPrompt: false
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
