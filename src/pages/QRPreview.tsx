import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { generateQRCode } from '../utils/qrGenerator';
import { Download, Printer, QrCode, CheckCircle, Clock, User, Pill } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import { Prescription } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const QRPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'prescriptions', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Prescription;
          setPrescription(data);

          // Generate QR code from encrypted data
          const qrDataUrl = await generateQRCode(data.qrEncrypted);
          setQrCode(qrDataUrl);
        } else {
          setError('Prescription not found');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('prescription-content');
    const opt = {
      margin: 1,
      filename: `prescription-${prescription?.patientName}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  const isExpired = prescription ? new Date(prescription.expiry) < new Date() : false;

  if (loading) {
    return (
      <Layout title="Prescription Preview">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading prescription..." />
        </div>
      </Layout>
    );
  }

  if (error || !prescription) {
    return (
      <Layout title="Prescription Preview">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || 'Prescription not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Prescription Preview">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6 print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        {/* Prescription Content */}
        <div id="prescription-content" className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Prescription</h1>
                <p className="text-gray-600 mt-1">Samraksha - Secure Prescription System</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Prescription ID</p>
                <p className="font-mono text-sm text-gray-900">{prescription.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prescription Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Doctor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5 text-teal-600" />
                  <span>Doctor Information</span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {prescription.doctorName}</p>
                  <p><span className="font-medium">Email:</span> {prescription.doctorEmail}</p>
                  <p><span className="font-medium">Date:</span> {new Date(prescription.timestamp).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Patient Information</span>
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {prescription.patientName}</p>
                  <p><span className="font-medium">Aadhaar:</span> {prescription.aadhaar}</p>
                  {prescription.phone && (
                    <p><span className="font-medium">Phone:</span> {prescription.phone}</p>
                  )}
                </div>
              </div>

              {/* Prescription Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-green-600" />
                  <span>Prescription Details</span>
                </h3>
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Medicine:</span> {prescription.medicine}</p>
                  <p><span className="font-medium">Dosage:</span> {prescription.dosage}</p>
                  <p><span className="font-medium">Instructions:</span> {prescription.instructions}</p>
                  <div className="flex items-center space-x-2 pt-2">
                    {isExpired ? (
                      <>
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-medium">Expired on {new Date(prescription.expiry).toLocaleDateString()}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">Valid until {new Date(prescription.expiry).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <span>Verification QR Code</span>
                </h3>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  {qrCode && (
                    <img
                      src={qrCode}
                      alt="Prescription QR Code"
                      className="mx-auto mb-4 rounded-lg shadow-sm"
                    />
                  )}
                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code to verify the prescription
                  </p>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                    isExpired 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isExpired ? (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Expired</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Valid</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center text-sm text-gray-500">
              <p>This is a digitally generated prescription from Samraksha System</p>
              <p>For verification, scan the QR code or contact the issuing doctor</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QRPreview;