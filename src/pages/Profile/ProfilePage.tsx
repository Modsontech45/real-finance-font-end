import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { countries } from "../../utils/countries";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Card from "../../components/UI/Card";
import toast from "react-hot-toast";
import { User, Settings, Save } from "lucide-react";
import { userService } from "../../services/userService";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  companyName: yup.string().required("Company name is required"),
  country: yup.string().required("Country is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  country: string;
  phoneNumber: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      companyName: user?.company_name || "",
      country: user?.country || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await userService.updateProfile(data);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const countryOptions = countries.map((country) => ({
    value: country.code,
    label: country.name,
  }));

  const selectedCountry = countries.find((c) => c.code === user?.country);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/80">Manage your personal information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card>
          <div>
            <div className="text-center">
              <Settings className="w-6 h-6 text-white/70" />
              <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
            </div>
            <h2 className="text-xl font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-white/80">{user?.email}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">role:</span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user?.role === "admin"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Status:</span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user?.is_verified
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {user?.is_verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Company:</span>
                <span className="text-white">{user?.company_name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Country:</span>
                <span className="text-white">{selectedCountry?.name}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-white/70" />
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? "Edit Profile" : "Profile Information"}
                </h2>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>

            {!isEditing ? (
              // Display Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      First Name
                    </label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/20">
                      {user?.firstName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Last Name
                    </label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/20">
                      {user?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email Address
                    </label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/20">
                      {user?.email}
                    </p>
                  </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Phone Number
                  </label>
                  <p className="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/20">
                    {user?.phoneNumber}
                  </p>
                </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    label="Email Address"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="Enter your email"
                    disabled
                    helpText="Email cannot be changed. Contact support if needed."
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Phone Number
                  </label>
                  <div className="flex rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/30 focus-within:border-blue-400 transition-all duration-300 bg-white/5 backdrop-blur-sm">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-4 py-3 bg-white/10 text-white/80 text-sm font-medium border-r border-white/20">
                        {selectedCountry?.dialCode}
                      </span>
                    </div>
                    <input
                      {...register("phoneNumber")}
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Settings className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-200">
                        role Restrictions
                      </h3>
                      <div className="mt-2 text-sm text-yellow-100">
                        <p>
                          Your role and certain permissions cannot be modified
                          through this form. Contact your administrator for role
                          changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
