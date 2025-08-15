import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  CreditCard,
  Settings,
  LogOut,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getAdminData } from "../../utils/sessionUtils";
import toast from "react-hot-toast";

const Sidebar: React.FC = () => {
  const { logout } = useAuth(); // logout should come from AuthContext
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userData = getAdminData(); // Admin data from local storage
  console.log("[Sidebar] User Data:", userData);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/reports", icon: TrendingUp, label: "Reports" },
    { to: "/notice-board", icon: MessageSquare, label: "Notice Board" },
    { to: "/members", icon: Users, label: "Members", adminOnly: true },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/subscription", icon: CreditCard, label: "Subscription" },
    { to: "/settings", icon: Settings, label: "Settings", adminOnly: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) =>
      !item.adminOnly ||
      (item.adminOnly && userData?.roles?.includes("super_admin"))
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-r border-white/20 
        w-64 min-h-screen flex flex-col shadow-lg
        fixed lg:static top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FinanceTracker</h1>
              <p className="text-sm text-white/70">{userData?.company?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-white/20 to-white/10 text-white border-r-2 border-white shadow-sm"
                        : "text-white/80 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userData?.fullName}
              </p>
              <p className="text-xs text-white/70 capitalize">
                {userData?.roles?.[0] || "user"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-left text-white/80 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
