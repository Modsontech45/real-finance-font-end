import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoginData } from "../../types";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import Footer from "../../components/Layout/Footer";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/app/dashboard");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex-1 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl lg:text-3xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            Access your financial dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <Card className="shadow-xl border-0 bg-white/10 backdrop-blur-sm border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="Enter your email"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                showPasswordToggle
                {...register("password")}
                error={errors.password?.message}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-white"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-300 hover:text-blue-200"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                loading={isLoading}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white/80">
                    New to FinanceTracker?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/app/signup"
                  className="w-full flex justify-center py-3 px-4 border border-white/30 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Create admin account
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

export default LoginPage;
