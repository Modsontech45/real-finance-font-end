import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useAppearance } from "../../contexts/AppearanceContext";
import { currencies } from "../../utils/currencies";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Card from "../../components/UI/Card";
import toast from "react-hot-toast";
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Globe,
  Download,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";
import { UserRole } from "../../types";
import DepartmentManager from "../../components/UI/DepartmentList";
import { apiClient } from "../../services/api";
import { setAdminData } from "../../utils/sessionUtils";

interface NotificationSettings {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuth();

  const {
    settings,
    updateTheme,
    updateCompactView,
    updateAnimationEffects,
    updateCurrency,
    isDarkMode,
  } = useAppearance();

  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    transactionAlerts: true,
    weeklyReports: false,
    securityAlerts: true,
  });

// Restrict access to admin or manager
// Normalize roles to lowercase for safety
const userRoles = user?.roles.map((r) => r.toLowerCase()) || [];

if (!userRoles.includes(UserRole.SUPER_ADMIN) && !userRoles.includes(UserRole.MANAGER)) {
  console.log("[SettingsPage] Access denied for user roles:", userRoles);
  return (
    <div className="p-4 text-red-600 font-semibold">
      Access denied. You must be an admin or manager to view this page.
    </div>
  );
}



  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.symbol})`,
  }));

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCurrency(e.target.value);
    toast.success("Currency updated successfully");
  };

  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors, isSubmitting: isSecuritySubmitting },
    reset: resetSecurity,
  } = useForm<SecuritySettings>();

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Notification settings updated");
  };

  const onSecuritySubmit = async (data: SecuritySettings) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      toast.success("Password updated successfully");
      resetSecurity();
    } catch {
      toast.error("Failed to update password");
    }
  };

  const handleExportData = () => {
    toast.success(
      "Data export initiated. You will receive an email when ready."
    );
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast.error(
        "Account deletion requested. Please check your email for confirmation."
      );
    }
  };

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "data", name: "Data & Privacy", icon: Globe },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/80">Manage your application preferences</p>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card padding="none">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-500/20 text-blue-300 border-r-2 border-blue-400"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                General Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company Name"
                      value={user?.company?.name || ""}
                      disabled
                      helpText="Contact support to change company name"
                    />
                    <Input
                      label="Country"
                      value={user?.country || ""}
                      disabled
                      helpText="Country cannot be changed after registration"
                    />
                  </div>
                </div>

                <DepartmentManager
                  initialDepartments={user?.company?.departments || []}
                  onAddDepartment={async (depts) => {
                    await apiClient
                      .put(`/companies/${user?.company?.id}`, {
                        departments: depts,
                      })
                      .catch((err) => {
                        console.error(err);
                        // alert("Failed to update departments: " + err.message);
                        throw err;
                      });
                    const updatedUser = {
                      ...user,
                      company: { ...user.company, departments: depts },
                    };
                    setUser(updatedUser);
                    setAdminData(updatedUser);
                  }}
                />

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Application Preferences
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">
                        Default Currency
                      </h4>
                      <Select
                        value={settings.currency}
                        onChange={handleCurrencyChange}
                        options={currencyOptions}
                      />
                      <p className="text-sm text-white/70 mt-1">
                        This will be used for displaying amounts throughout the
                        application
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          Auto-save transactions
                        </h4>
                        <p className="text-sm text-white/70">
                          Automatically save transaction drafts
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          Show transaction previews
                        </h4>
                        <p className="text-sm text-white/70">
                          Display quick previews on hover
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                Security Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Change Password
                  </h3>
                  <form
                    onSubmit={handleSecuritySubmit(onSecuritySubmit)}
                    className="space-y-4"
                  >
                    <Input
                      label="Current Password"
                      type="password"
                      showPasswordToggle
                      {...registerSecurity("currentPassword", {
                        required: "Current password is required",
                      })}
                      error={securityErrors.currentPassword?.message}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      showPasswordToggle
                      {...registerSecurity("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      error={securityErrors.newPassword?.message}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      showPasswordToggle
                      {...registerSecurity("confirmPassword", {
                        required: "Please confirm your password",
                      })}
                      error={securityErrors.confirmPassword?.message}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSecuritySubmitting}
                      className="flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Password</span>
                    </Button>
                  </form>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                    <div className="flex">
                      <Shield className="h-5 w-5 text-yellow-300" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-200">
                          Enhanced Security Available
                        </h4>
                        <div className="mt-2 text-sm text-yellow-100">
                          <p>
                            Enable two-factor authentication for additional
                            account security.
                          </p>
                        </div>
                        <Button variant="secondary" size="sm" className="mt-3">
                          Enable 2FA
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels = {
                    emailNotifications: {
                      title: "Email Notifications",
                      description: "Receive general updates via email",
                    },
                    transactionAlerts: {
                      title: "Transaction Alerts",
                      description:
                        "Get notified when new transactions are added",
                    },
                    weeklyReports: {
                      title: "Weekly Reports",
                      description: "Receive weekly financial summary reports",
                    },
                    securityAlerts: {
                      title: "Security Alerts",
                      description: "Important security and login notifications",
                    },
                  };

                  const label = labels[key as keyof NotificationSettings];

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          {label.title}
                        </h4>
                        <p className="text-sm text-white/70">
                          {label.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() =>
                          handleNotificationChange(
                            key as keyof NotificationSettings
                          )
                        }
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                Appearance Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        id: "light",
                        name: "Light",
                        description: "Always use light theme",
                      },
                      {
                        id: "dark",
                        name: "Dark",
                        description: "Always use dark theme",
                      },
                      {
                        id: "auto",
                        name: "Auto",
                        description: "Match system preference",
                      },
                    ].map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => updateTheme(theme.id as any)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          settings.theme === theme.id
                            ? "border-blue-400 bg-blue-500/20"
                            : "border-white/30 hover:border-white/50"
                        }`}
                      >
                        <h4 className="font-medium text-white">{theme.name}</h4>
                        <p className="text-sm text-white/70">
                          {theme.description}
                        </p>
                        {settings.theme === theme.id && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/30 text-blue-200">
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                    <p className="text-sm text-blue-200">
                      <strong>Current mode:</strong>{" "}
                      {isDarkMode ? "Dark" : "Light"} theme is active
                      {settings.theme === "auto" &&
                        " (based on system preference)"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Display Options
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          Compact view
                        </h4>
                        <p className="text-sm text-white/70">
                          Show more data in less space
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.compactView}
                        onChange={(e) => updateCompactView(e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          Animation effects
                        </h4>
                        <p className="text-sm text-white/70">
                          Enable smooth transitions and animations
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.animationEffects}
                        onChange={(e) =>
                          updateAnimationEffects(e.target.checked)
                        }
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "data" && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                Data & Privacy
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Data Export
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    Download all your financial data in a portable format.
                  </p>
                  <Button
                    onClick={handleExportData}
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          Analytics tracking
                        </h4>
                        <p className="text-sm text-white/70">
                          Help improve the app with usage analytics
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          Performance monitoring
                        </h4>
                        <p className="text-sm text-white/70">
                          Monitor app performance and errors
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-red-300 mb-4">
                    Danger Zone
                  </h3>
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-300" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-red-200">
                          Delete Account
                        </h4>
                        <p className="mt-1 text-sm text-red-100">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                        <Button
                          onClick={handleDeleteAccount}
                          variant="danger"
                          size="sm"
                          className="mt-3 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Account</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
