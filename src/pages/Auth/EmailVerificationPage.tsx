import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import toast from 'react-hot-toast';
import { Mail, CheckCircle } from 'lucide-react';
import Footer from '../../components/Layout/Footer';

const EmailVerificationPage: React.FC = () => {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Verification email sent successfully!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="flex-1 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-white/80">
          We've sent a verification link to your email address
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-medium text-white">
                Account Created Successfully!
              </h3>
              <p className="text-sm text-white/80">
                Please check your email and click the verification link to activate your account.
              </p>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-sm text-yellow-200">
                <strong>Important:</strong> The verification link will expire in 24 hours.
                Check your spam folder if you don't see the email.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                variant="primary"
                className="w-full"
                loading={isResending}
              >
                Resend verification email
              </Button>

              <Link
                to="/login"
                className="block w-full text-center py-2 px-4 border border-white/30 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmailVerificationPage;