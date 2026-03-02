// Verified sustainability clients
// Add client emails here after reviewing their documentation

export interface VerifiedClient {
  email: string;
  level: number; // 1-4 sustainability level
  verifiedDate: string;
  notes?: string;
}

export const verifiedClients: VerifiedClient[] = [
  // Example entries - replace with real verified clients
  // {
  //   email: "john@sustainablebrand.com",
  //   level: 3, // Impact Leader - 25% off
  //   verifiedDate: "2025-01-01",
  //   notes: "B-Corp certified, excellent documentation"
  // },
  // {
  //   email: "sarah@greenbusiness.co.uk", 
  //   level: 2, // Conscious Brand - 15% off
  //   verifiedDate: "2025-01-01",
  //   notes: "Good sustainable packaging practices"
  // }
];

export const getVerifiedLevel = (email: string): number => {
  const client = verifiedClients.find(c => c.email.toLowerCase() === email.toLowerCase());
  return client ? client.level : 1; // Default to level 1 if not verified
};

export const isEmailVerified = (email: string): boolean => {
  return verifiedClients.some(c => c.email.toLowerCase() === email.toLowerCase());
};