import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { verifyNMCLicense } from '../utils/nmcApi';
import { Badge, CheckCircle, AlertCircle, User, FileText } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';

const LicenseVerification: React.FC = () => {
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const verification = await verifyNMCLicense(license);
      
      if (!verification.success) {
        setError(verification.error || 'License verification failed');
        return;
      }

      // Store doctor data in Firestore
      const user = auth.currentUser;
      if (!user) {
        setError('Authentication error');
        return;
      }

      await setDoc(doc(db, 'doctors', user.uid), {
        email: user.email,
        name: name,
        license: license,
        verified: true,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      
      // Redirect after successful verification
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout title="License Verification">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Successful!</h3>
            <p className="text-gray-600 mb-4">Your medical license has been verified successfully.</p>
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" text="Redirecting to dashboard..." />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="License Verification">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Badge className="w-12 h-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Verify Your Medical License</h3>
            <p className="text-gray-600 mt-2">
              Please provide your details for NMC license verification
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Dr. Your Full Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">
                NMC License Number
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="license"
                  type="text"
                  required
                  value={license}
                  onChange={(e) => setLicense(e.target.value.toUpperCase())}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="AP123456"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Try: AP123456, KA789012, TN345678, or MH901234 for demo
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all disabled:opacity-50 font-medium"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Badge className="w-5 h-5" />
                  <span>Verify License</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LicenseVerification;