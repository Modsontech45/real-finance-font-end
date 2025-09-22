import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";
import { AppearanceProvider } from "./contexts/AppearanceContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import EmailVerification from "./pages/Auth/verifyemail";

// App Pages
import FinanceLandingPage from "./pages/landingpage/landing";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import NoticeBoardPage from "./pages/NoticeBoard/NoticeBoardPage";
import MembersPage from "./pages/Members/MembersPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SubscriptionPage from "./pages/Subscription/SubscriptionPage";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <AppearanceProvider>
        <AuthProvider>
          <Router>
            <div className="App min-h-screen">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { background: "#363636", color: "#fff" },
                  success: {
                    duration: 3000,
                    style: { background: "#059669" },
                  },
                  error: {
                    duration: 4000,
                    style: { background: "#DC2626" },
                  },
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<FinanceLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/email-verification"
                  element={<EmailVerificationPage />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/verify-email" element={<EmailVerification />} />

                {/* Protected Routes */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate to="/app/dashboard" replace />}
                  />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="notice-board" element={<NoticeBoardPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="subscription" element={<SubscriptionPage />} />

                  {/* Admin Only */}
                  <Route
                    path="members"
                    element={
                      <ProtectedRoute adminOnly>
                        <MembersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute adminOnly>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </AppearanceProvider>
    </div>
  );
}

export default App;
