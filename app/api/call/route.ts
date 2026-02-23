import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { visitorName, visitorPhone, residentPhone, residentName, email, reason } = await request.json();

    // ==========================================
    // 1. LOG THE DATA TO GOOGLE SHEETS
    // ==========================================
    try {
      let googleFormData;
      let formUrl;

      if (email && reason) {
        googleFormData = new URLSearchParams({
          'entry.1624763305': visitorName,      
          'entry.2095382593': visitorPhone,     
          'entry.1040377282': email,            
          'entry.2118777131': reason            
        });
        formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfcmU3HUXMpCF8-n64Ud5OVdemTmiUEk21B3wXO8ut__pT3jA/formResponse';
      } else {
        googleFormData = new URLSearchParams({
          'entry.1118496355': visitorName,      
          'entry.1247426777': visitorPhone,     
          'entry.926817152': residentName       
        });
        formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc1WYqVMwcZeSZIKuHcbaKsYd4dupT6-QzcOePOxPFOqjrrBg/formResponse';
      }

      await fetch(formUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: googleFormData.toString()
      });
    } catch (logError) {
      console.error('Logging silently failed.', logError);
    }

    // ==========================================
    // 2. TWILIO CONFIGURATION
    // ==========================================
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_PHONE_NUMBER) {
      return NextResponse.json({ error: 'System Setup Incomplete' }, { status: 500 });
    }

    const cleanResidentNumber = residentPhone.replace(/\D/g, '').slice(-10);
    const formattedResidentPhone = `+1${cleanResidentNumber}`;
    const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    // ==========================================
    // 3. EAGLE EYE + SMS INTERCEPT (THE WOW FACTOR)
    // ==========================================
    // 🔀 UPDATED: Now triggers from the main dropdown OR the dedicated Packages page!
    if (reason === "Package / Delivery Courier" || residentName === "Leasing Office (Delivery)") {
      try {
        // [FUTURE TODO]: Ping the Eagle Eye API here to get the real snapshot URL
        // const eagleEyeResponse = await fetch('https://api.een.com/YOUR_ENDPOINT');
        // const imageUrl = await eagleEyeResponse.json();
        
        // For now, we use a placeholder image to prove the SMS workflow works
        const placeholderImageUrl = "https://images.unsplash.com/photo-1620455800201-7f00aeec126f?q=80&w=800&auto=format&fit=crop";

        // Send the SMS via Twilio Messages API
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: formattedResidentPhone, // Sends text to the Leasing Office
            From: TWILIO_PHONE_NUMBER,
            Body: `🚨 GATE ALERT: Delivery driver (${visitorName}) is requesting access at the gate. Connecting call now...`,
            MediaUrl: placeholderImageUrl // This attaches the photo!
          }).toString()
        });
        console.log("Delivery SMS sent successfully!");
      } catch (smsError) {
        console.error("Failed to send Delivery SMS:", smsError);
      }
    }

    // ==========================================
    // 4. TRIGGER THE ACTUAL PHONE CALL
    // ==========================================
    const twiml = `
      <Response>
        <Say>Please wait while we connect your secure call.</Say>
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
        To: visitorPhone,
        From: TWILIO_PHONE_NUMBER,
        Twiml: twiml
      }).toString()
    });

    if (!twilioResponse.ok) {
      return NextResponse.json({ error: 'Call failed to connect' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Process complete!' });

  } catch (error: any) {
    console.error('Switchboard Crash:', error);
    return NextResponse.json({ error: 'Critical System Crash' }, { status: 500 });
  }
}
