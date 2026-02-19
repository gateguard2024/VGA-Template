import { NextResponse } from 'next/server';
import { SDK } from '@ringcentral/sdk';

export async function POST(req: Request) {
    try {
        const { residentPhone } = await req.json();

        const rcsdk = new SDK({
            server: 'https://platform.ringcentral.com',
            clientId: process.env.RC_CLIENT_ID,
            clientSecret: process.env.RC_CLIENT_SECRET
        });

        const platform = rcsdk.platform();

        // Login using the JWT you generated
        await platform.login({ jwt: process.env.RC_JWT_TOKEN });

        // RingOut initiates the masked privacy call
        await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
            from: { phoneNumber: process.env.RC_USERNAME }, 
            to: { phoneNumber: residentPhone }, 
            callerId: { phoneNumber: process.env.RC_USERNAME },
            playPrompt: false
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("RingCentral Error:", error.message);
        return NextResponse.json({ error: 'Bridge Offline', details: error.message }, { status: 500 });
    }
}
