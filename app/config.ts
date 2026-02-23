export const SITE_CONFIG = {
  // Property Branding - Now dynamically pulling from Vercel!
  propertyName: process.env.NEXT_PUBLIC_PROPERTY_NAME || "Elevate Eagles Landing",
  propertyAddress: process.env.NEXT_PUBLIC_PROPERTY_ADDRESS || "700 Rock Quarry Road",
  brandName: "Gate Guard",
  footerText: "Gate Guard Security Interface",
  
  // Contact Numbers - Now dynamically pulling from Vercel!
  officePhone: process.env.NEXT_PUBLIC_OFFICE_PHONE || "7705256055",      
  emergencyPhone: process.env.NEXT_PUBLIC_EMERGENCY_PHONE || "4048425072",     
  
  // Office Hours (24-hour format)
  hours: {
    weekdays: { open: 10, close: 18 }, // Mon-Fri: 10am - 6pm
    saturday: { open: 10, close: 17 }, // Sat: 10am - 5pm
    sunday: { closed: true }           // Sun: Closed
  },

  // Geofencing Coordinates (Elevate Eagles Landing)
  location: {
    lat: 34.3615, 
    lng: -84.3978, 
    radius: 1.5  
  },

  // Brivo Settings (Reference)
  brivoAccountId: "75828250",
  
  // Delivery Instructions
  deliveryInstructions: "Please deliver all packages to the Leasing Office during business hours. Use the call button for entry assistance."
};
