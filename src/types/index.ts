export interface Doctor {
  email: string;
  name: string;
  license: string;
  verified: boolean;
  createdAt: string;
}

export interface Prescription {
  id?: string;
  doctorEmail: string;
  doctorName: string;
  patientName: string;
  aadhaar: string;
  phone?: string;
  medicine: string;
  dosage: string;
  instructions: string;
  validityDays: number;
  expiry: string;
  qrEncrypted: string;
  timestamp: string;
}

export interface VerificationResult {
  isValid: boolean;
  prescription?: Prescription;
  error?: string;
}