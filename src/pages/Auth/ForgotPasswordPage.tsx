import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import Footer from '../../components/Layout/Footer';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface FormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="flex-1 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-white/80">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Enter your email address"
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isSubmitting}
            >
              Send reset link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-blue-300 hover:text-blue-200"
            >
              Back to login
            </Link>
          </div>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;