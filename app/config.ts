export const SITE_CONFIG = {
  // Property Branding
  propertyName: "Elevate Eagles Landing",
  propertyAddress: "700 Rock Quarry Road",
  brandName: "Gate Guard",
  footerText: "Gate Guard Security Interface",
  
  // Contact Numbers
  officePhone: "7705256055",      // Standard Leasing Office
  emergencyPhone: "4048425072",     // After-Hours/Emergency Call Center
  
  // Office Hours (24-hour format)
  hours: {
    weekdays: { open: 10, close: 18 }, // Mon-Fri: 10am - 6pm
    saturday: { open: 10, close: 17 }, // Sat: 10am - 5pm
    sunday: { closed: true }           // Sun: Closed
  },

  // Geofencing Coordinates (Elevate Eagles Landing)
  location: {
    lat: 33.9200, // Exact Rock Quarry Rd gate
    lng: -84.3560, // Exact Rock Quarry Rd gate
    radius: 1.5  // Miles (1/2 mile)
  },

  // Brivo Settings (Reference)
  brivoAccountId: "75828250",
  
  // Delivery Instructions
  deliveryInstructions: "Please deliver all packages to the Leasing Office during business hours. Use the call button for entry assistance."
};
