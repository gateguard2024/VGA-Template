import { NextResponse } from 'next/server';

export async function GET() {
  // --- START DUMMY DATA ---
  // We use this so you can test functionality immediately.
  const dummyResidents = [
    { 
      id: "test-1", 
      firstName: "Russel", 
      lastName: "Feldman", 
      phoneNumber: "+17707768095" // Use your real number here to test the call!
    },
    { 
      id: "test-2", 
      firstName: "Madison", 
      lastName: "Dunn", 
      phoneNumber: "+18287197252" 
    },
    { 
      id: "test-3", 
      firstName: "Sharmila", 
      lastName: "Prabhu", 
      phoneNumber: "+17705959206" 
    }
  ];
  // --- END DUMMY DATA ---

  try {
    const { BRIVO_API_KEY, BRIVO_CLIENT_ID, BRIVO_CLIENT_SECRET, BRIVO_USERNAME, BRIVO_PASSWORD } = process.env;

    // If you don't have keys yet, just return the dummy data
    if (!BRIVO_API_KEY) {
      return NextResponse.json(dummyResidents);
    }

    // ... (Your existing Brivo fetch logic here) ...
    // If Brivo fails or is empty, you can also return dummyResidents as a fallback.
    return NextResponse.json(dummyResidents);

  } catch (error) {
    // Fallback to dummy data even on error so your UI doesn't break
    return NextResponse.json(dummyResidents);
  }
}
