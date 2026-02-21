import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // We expect the frontend to send us the visitor's typed number and the resident's hidden number
    const { visitorPhone, residentPhone } = await request.json();

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_PHONE_NUMBER) {
      console.error('Missing Twilio Environment Variables!');
      return NextResponse.json({ error: 'System Setup Incomplete' }, { status: 500 });
    }

    // 1. Create the Basic Auth Header for Twilio
    const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    // 2. Write the TwiML (Twilio Markup Language) Instructions
    // This tells Twilio what to do the exact second the visitor answers their ringing phone
    const twiml = `
      <Response>
        <Say>Please wait while we connect you to the resident.</Say>
        <Dial callerId="${TWILIO_PHONE_NUMBER}">${residentPhone}</Dial>
      </Response>
    `;

    // 3. Command Twilio to trigger the Call
    const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Using URLSearchParams to format the data exactly how Twilio requires it
      body: new URLSearchParams({
        To: visitorPhone, // Leg 1: Call the visitor first
        From: TWILIO_PHONE_NUMBER, // The Caller ID they will see
        Twiml: twiml // Execute the instructions above when they answer
      }).toString()
    });

    const data = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio Rejected Call:', data);
      return NextResponse.json({ error: 'Call failed to connect' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Twilio is dialing the visitor now!' });

  } catch (error: any) {
    console.error('Switchboard Crash:', error);
    return NextResponse.json({ error: 'Critical System Crash' }, { status: 500 });
  }
}
