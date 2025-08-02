import React, { useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { decryptData } from '../utils/encryption';
import { QrCode, Upload, CheckCircle, XCircle, Camera, Clock, User, Pill } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import { Prescription } from '../types';

const VerifyPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    prescription?: Prescription;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const verifyQRData = async (qrData: string) => {
    setLoading(true);
    setVerificationResult(null);

    try {
      // Decrypt the QR data
      const decryptedData = decryptData(qrData);
      
      // Verify the prescription exists in database
      const q = query(
        collection(db, 'prescriptions'),
        where('doctorEmail', '==', decryptedData.doctorEmail),
        where('patientName', '==', decryptedData.patientName),
        where('aadhaar', '==', decryptedData.aadhaar)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setVerificationResult({
          isValid: false,
          error: 'Prescription not found in database'
        });
        return;
      }

      // Get the prescription data
      const prescriptionDoc = querySnapshot.docs[0];
      const prescription = { id: prescriptionDoc.id, ...prescriptionDoc.data() } as Prescription;

      // Check if prescription is expired
      const isExpired = new Date(prescription.expiry) < new Date();
      
      if (isExpired) {
        setVerificationResult({
          isValid: false,
          prescription,
          error: 'Prescription has expired'
        });
        return;
      }

      // Prescription is valid
      setVerificationResult({
        isValid: true,
        prescription
      });

    } catch (error: any) {
      setVerificationResult({
        isValid: false,
        error: 'Invalid QR code or corrupted data'
      });
    } finally {
      setLoading(false);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setVerificationResult(null);

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(
      (qrData) => {
        scanner.clear();
        setIsScanning(false);
        verifyQRData(qrData);
      },
      (error) => {
        console.log('QR scan error:', error);
      }
    );

    scannerRef.current = scanner;
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      const qrData = await html5QrCode.scanFile(file, true);
      verifyQRData(qrData);
    } catch (error) {
      setVerificationResult({
        isValid: false,
        error: 'Could not read QR code from image'
      });
    }
  };

  return (
    <Layout title="Verify Prescription QR Code">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanning Options */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>Scan QR Code</span>
              </h3>

              {!isScanning ? (
                <div className="space-y-4">
                  <button
                    onClick={startScanning}
                    className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Camera Scan</span>
                  </button>
                  
                  <div className="text-center text-gray-500">
                    <span>or</span>
                  </div>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload QR Image</span>
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={stopScanning}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
                  >
                    Stop Scanning
                  </button>
                </div>
              )}

              <div id="qr-reader" className="mt-4"></div>
            </div>
          </div>

          {/* Verification Results */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Result</h3>

              {loading && (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" text="Verifying prescription..." />
                </div>
              )}

              {verificationResult && !loading && (
                <div className="space-y-4">
                  {verificationResult.isValid ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold">Valid Prescription</span>
                      </div>

                      {verificationResult.prescription && (
                        <div className="space-y-4">
                          {/* Patient Info */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                              <User className="w-4 h-4 text-blue-600" />
                              <span>Patient Information</span>
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {verificationResult.prescription.patientName}</p>
                              <p><span className="font-medium">Aadhaar:</span> {verificationResult.prescription.aadhaar}</p>
                              {verificationResult.prescription.phone && (
                                <p><span className="font-medium">Phone:</span> {verificationResult.prescription.phone}</p>
                              )}
                            </div>
                          </div>

                          {/* Prescription Info */}
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                              <Pill className="w-4 h-4 text-green-600" />
                              <span>Prescription Details</span>
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Medicine:</span> {verificationResult.prescription.medicine}</p>
                              <p><span className="font-medium">Dosage:</span> {verificationResult.prescription.dosage}</p>
                              <p><span className="font-medium">Instructions:</span> {verificationResult.prescription.instructions}</p>
                              <p><span className="font-medium">Valid Until:</span> {new Date(verificationResult.prescription.expiry).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          <div className="bg-teal-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Doctor Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {verificationResult.prescription.doctorName}</p>
                              <p><span className="font-medium">Email:</span> {verificationResult.prescription.doctorEmail}</p>
                              <p><span className="font-medium">Date Issued:</span> {new Date(verificationResult.prescription.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-red-600">
                        <XCircle className="w-6 h-6" />
                        <span className="font-semibold">Invalid Prescription</span>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-800">{verificationResult.error}</p>
                      </div>

                      {verificationResult.prescription && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Prescription Found but Expired</span>
                          </div>
                          <div className="text-sm text-yellow-700">
                            <p><span className="font-medium">Patient:</span> {verificationResult.prescription.patientName}</p>
                            <p><span className="font-medium">Medicine:</span> {verificationResult.prescription.medicine}</p>
                            <p><span className="font-medium">Expired on:</span> {new Date(verificationResult.prescription.expiry).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!verificationResult && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Scan or upload a QR code to verify prescription</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyPage;