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
    const twilioAuthHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    // ==========================================
    // 3. BRIVO AUTH & SMS INTERCEPT
    // ==========================================
    if (reason === "Package / Delivery Courier" || residentName === "Leasing Office (Delivery)") {
      try {
        let snapshotUrl = "https://images.unsplash.com/photo-1620455800201-7f00aeec126f?q=80&w=800&auto=format&fit=crop"; // Fallback Image
        
        // Check if Brivo Keys exist in Vercel
        if (process.env.BRIVO_API_KEY && process.env.BRIVO_CLIENT_ID) {
           console.log("Brivo credentials found. Attempting secure login...");
           
           const brivoAuthString = Buffer.from(`${process.env.BRIVO_CLIENT_ID}:${process.env.BRIVO_CLIENT_SECRET}`).toString('base64');
           
           // Shake hands with Brivo to get a secure Access Token
           const brivoTokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
             method: 'POST',
             headers: {
               'Authorization': `Basic ${brivoAuthString}`,
               'api-key': process.env.BRIVO_API_KEY,
               'Content-Type': 'application/x-www-form-urlencoded'
             },
             body: new URLSearchParams({
               grant_type: 'password',
               username: process.env.BRIVO_USERNAME!,
               password: process.env.BRIVO_PASSWORD!
             })
           });

           if (brivoTokenResponse.ok) {
              const tokenData = await brivoTokenResponse.json();
              console.log("✅ Brivo Login Successful! Token acquired.");
              
              // We will build the snapshot proxy in the next step using Camera ID 76666830
              // For now, we confirm login works.
           } else {
              console.error("❌ Brivo Login Failed. Check your Vercel keys.");
           }
        }

        // Send the SMS via Twilio Messages API
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${twilioAuthHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: formattedResidentPhone, 
            From: TWILIO_PHONE_NUMBER,
            Body: `🚨 GATE ALERT: Delivery driver (${visitorName}) is requesting access at the gate. Connecting call now...`,
            MediaUrl: snapshotUrl
          }).toString()
        });
      } catch (smsError) {
        console.error("Failed to process Delivery SMS:", smsError);
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
        'Authorization': `Basic ${twilioAuthHeader}`,
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
