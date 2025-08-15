import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SignupData } from "../../types";
import { countries } from "../../utils/countries";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Card from "../../components/UI/Card";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import Footer from "../../components/Layout/Footer";

const schema = yup.object({
  firstName: yup.string().required("First name is required").min(3),
  lastName: yup.string().required("Last name is required").min(3),
  companyName: yup.string().required("Company name is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const SignupPage: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState("US");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupData>({
    resolver: yupResolver(schema),
    defaultValues: { country: "US" },
  });

  const watchCountry = watch("country");

  const onSubmit = async (data: SignupData, event?: React.FormEvent) => {
    event?.preventDefault(); // prevent default submission
    try {
      await signup(data);
      toast.success(
        "Account created successfully! Please check your email for verification."
      );
      navigate("/email-verification");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setValue("country", countryCode);

    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setValue("phone", country.dialCode);
    }
  };

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const selectedCountryData = countries.find((c) => c.code === watchCountry);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex-1 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            Create Admin Account
          </h2>
          <p className="text-sm text-white/80 mt-2">
            Set up your company's financial tracking system
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <Card className="shadow-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="First Name"
                {...register("firstName")}
                error={errors.firstName?.message}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                error={errors.lastName?.message}
                placeholder="Enter your last name"
              />
              <Input
                label="Company Name"
                {...register("companyName")}
                error={errors.companyName?.message}
                placeholder="Enter your company name"
              />
              <Select
                label="Country"
                {...register("country")}
                error={errors.country?.message}
                options={countryOptions}
                onChange={handleCountryChange}
              />

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/30 focus-within:border-blue-400 transition-all duration-300 bg-white/5 backdrop-blur-sm">
                  <span className="inline-flex items-center px-4 py-3 bg-white/10 text-white/80 text-sm font-medium sm:border-r border-white/20 w-full sm:w-auto justify-center sm:justify-start">
                    {selectedCountryData?.dialCode}
                  </span>
                  <input
                    {...register("phone")}
                    className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <Input
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                type="password"
                showPasswordToggle
                {...register("password")}
                error={errors.password?.message}
                placeholder="Create a password"
              />
              <Input
                label="Confirm Password"
                type="password"
                showPasswordToggle
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your password"
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                loading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <span className="relative px-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white/80">
                  Already have an account?
                </span>
              </div>

              <Link
                to="/login"
                className="mt-6 w-full block text-center py-3 px-4 border border-white/30 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                Sign in to existing account
              </Link>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
