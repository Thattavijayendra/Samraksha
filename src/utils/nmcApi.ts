export interface NMCVerificationResponse {
  success: boolean;
  data?: {
    name: string;
    license: string;
    status: 'active' | 'inactive';
  };
  error?: string;
}

export const verifyNMCLicense = async (license: string): Promise<NMCVerificationResponse> => {
  // Mock NMC API verification - replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation logic
      const validLicenses = ['AP123456', 'KA789012', 'TN345678', 'MH901234'];
      
      if (validLicenses.includes(license)) {
        resolve({
          success: true,
          data: {
            name: license === 'AP123456' ? 'Dr. Vijayendra Sharma' : 'Dr. Licensed Physician',
            license: license,
            status: 'active'
          }
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid or inactive license number'
        });
      }
    }, 1500); // Simulate API delay
  });
};