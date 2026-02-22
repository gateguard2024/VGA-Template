import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { visitorName, visitorPhone, residentPhone, residentName } = await request.json();

    // ==========================================
    // 1. LOG THE DATA TO GOOGLE SHEETS
    // ==========================================
try {
      const googleFormData = new URLSearchParams({
        'entry.1118496355': visitorName,      // Visitor Name
        'entry.1247426777': visitorPhone,     // Visitor Phone
        'entry.926817152': residentName       // Resident Called
      });

      await fetch('https://docs.google.com/forms/d/e/1FAIpQLSc1WYqVMwcZeSZIKuHcbaKsYd4dupT6-QzcOePOxPFOqjrrBg/formResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: googleFormData.toString()
      });
      console.log("Logged call to Google Sheets successfully.");
    } catch (logError) {
      console.error('Logging silently failed.', logError);
    }

    // ==========================================
    // 2. TRIGGER THE TWILIO CALL
    // ==========================================
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_PHONE_NUMBER) {
      console.error("Missing Twilio Keys in Vercel!");
      return NextResponse.json({ error: 'System Setup Incomplete' }, { status: 500 });
    }

    // 🛑 CLEANUP: Strip all dashes/parentheses and grab exactly the last 10 digits
    const cleanResidentNumber = residentPhone.replace(/\D/g, '').slice(-10);
    const formattedResidentPhone = `+1${cleanResidentNumber}`;

    const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
    
    // The instructions Twilio will follow when the visitor answers their phone
    const twiml = `
      <Response>
        <Say>Please wait while we connect you to the resident.</Say>
        <Dial callerId="${TWILIO_PHONE_NUMBER}">${formattedResidentPhone}</Dial>
      </Response>
    `;

    const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: visitorPhone, // Call the visitor first
        From: TWILIO_PHONE_NUMBER, // Show the Gate Caller ID
        Twiml: twiml // Run the script above
      }).toString()
    });

    if (!twilioResponse.ok) {
      const errorData = await twilioResponse.json();
      console.error('Twilio Call Rejected:', errorData);
      return NextResponse.json({ error: 'Call failed to connect' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Twilio is dialing!' });

  } catch (error: any) {
    console.error('Switchboard Crash:', error);
    return NextResponse.json({ error: 'Critical System Crash' }, { status: 500 });
  }
}
