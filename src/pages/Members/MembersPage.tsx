import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMembers } from "../../hooks/useMembers";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import AnimatedCounter from "../../components/UI/AnimatedCounter";
import toast from "react-hot-toast";
import {
  Plus,
  Users,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Crown,
  Eye,
} from "lucide-react";
import { UserRole } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

interface InviteFormData {
  email: string;
  role: UserRole;
}

const MembersPage: React.FC = () => {
  const { user } = useAuth();
  const userRoles = React.useMemo(() => user?.roles, [user?.roles]);
  const isAdmin = React.useMemo(
    () =>
      userRoles === "super_admin" ||
      (Array.isArray(userRoles) && userRoles.includes("super_admin")),
    [userRoles]
  );
  const [showInviteForm, setShowInviteForm] = useState(false);
  const { members, isLoading, isInviting, inviteMember, removeMember } =
    useMembers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    defaultValues: { role: UserRole.MEMBER },
  });

  const onSubmit = async (data: InviteFormData) => {
    try {
      await inviteMember(data.email, [data.role]);
      reset();
      setShowInviteForm(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleRemoveMember = removeMember;
  const memberRoles = members.map((m) => m.roles.map((r) => r)).flat();
  const adminCount = members.filter((m) =>
    m.roles.some((r) => r === "super_admin")
  ).length;

  const viewerCount = members.filter((m) =>
    m.roles.some((r) => r === "member" || r === "manager")
  ).length;

  console.log(
    "[MembersPage] Admin Count:",
    adminCount,
    "Viewer Count:",
    viewerCount
  );

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 pt-16 lg:pt-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-4 lg:p-8 text-white">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">Team Members</h1>
          <p className="text-purple-100 text-sm lg:text-lg">
            Manage team access and permissions
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              onClick={() => setShowInviteForm(!showInviteForm)}
              variant="secondary"
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 text-sm lg:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Member</span>
            </Button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Members</p>
              <p className="text-2xl lg:text-3xl font-bold">
                <AnimatedCounter value={members.length} />
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-400/30 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-100" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Administrators</p>
              <p className="text-2xl lg:text-3xl font-bold">
                <AnimatedCounter value={adminCount} />
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-purple-100" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Viewers</p>
              <p className="text-2xl lg:text-3xl font-bold">
                <AnimatedCounter value={viewerCount} />
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-400/30 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-green-100" />
            </div>
          </div>
        </Card>
      </div>

      {/* Invite Form */}
      {showInviteForm && isAdmin && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-black text-black">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-black">
              Invite New Member
            </h2>
            <Button
              onClick={() => setShowInviteForm(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <Input
                label="Email Address"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email?.message}
                placeholder="Enter member's email"
              />

              <div>
                <label className="block text-sm font-medium text-black mb-1"></label>
                <select
                  {...register("role")}
                  className="block w-full capitalize rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black p-2"
                  // defaultValue="viewer"
                >
                  {Object.values(UserRole).map((role) =>
                    role !== UserRole.SUPER_ADMIN ? (
                      <option
                        key={role}
                        value={role}
                        selected={role == UserRole.MEMBER}
                        className="capitalize"
                      >
                        {role}
                      </option>
                    ) : null
                  )}
                </select>
                <p className="mt-1 text-sm text-white">
                  Invited <span className="italic">Members</span> will have
                  view-only access to financial data
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                loading={isInviting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full lg:w-auto"
              >
                Send Invitation
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Members List */}
      <Card className="shadow-lg border-0 bg-white text-black">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-emerald-500">
            Team Members
          </h2>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-yellow-500">
              {members.length} members
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" className="text-purple-600" />
            <span className="ml-3 text-gray-600">Loading members...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => {
              const adminUser = member.roles
                .map((r) => r)
                .includes(UserRole.SUPER_ADMIN);
              return (
                <div
                  key={member.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md space-y-3 lg:space-y-0"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base lg:text-lg font-medium text-white">
                          {member.username}
                        </h3>
                        {member.roles.includes(UserRole.SUPER_ADMIN) && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 text-sm text-black space-y-1 lg:space-y-0">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 text-emerald-700" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 lg:block hidden">
                          <Phone className="w-4 h-4 text-emerald-700" />
                          <span>{member.phoneNumber || "+2234546464"}</span>
                        </div>
                        <div className="flex items-center space-x-1 lg:block hidden">
                          <Calendar className="w-4 h-4 text-emerald-700" />
                          <span>
                            Joined{" "}
                            {new Date(member.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end space-x-3 lg:flex-shrink-0">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          adminUser
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {adminUser
                          ? "Admin"
                          : member.roles.includes(UserRole.MANAGER)
                          ? "Manager"
                          : "Viewer"}
                      </span>

                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.isEmailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {member.isEmailVerified ? "Verified" : "Pending"}
                      </span>
                    </div>

                    {!adminUser && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {members.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg font-medium text-black">No members yet</h3>
            <p className="text-black">Invite team members to collaborate</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MembersPage;
