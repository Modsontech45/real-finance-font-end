import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";

const API_BASE = "https://finance-backendsynctuario.onrender.com/api"; // change to production URL if needed

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.error || "Invalid or expired verification link.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Server error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  const handleLogin = () => navigate("/login");

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Synctuario
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-md border-2 border-green-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Email Verification
              </h1>
            </div>

            <div className="space-y-4">
              {status === "loading" && (
                <>
                  <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto" />
                  <p className="text-green-300 text-lg">Verifying your email...</p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                  <p className="text-green-300 text-lg font-semibold">✅ {message}</p>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                  >
                    <span>Go to Login</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {status === "error" && (
                <>
                  <XCircle className="w-16 h-16 text-red-400 mx-auto" />
                  <p className="text-red-300 text-lg font-semibold">❌ {message}</p>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <span>Back to Login</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {(status === "success" || status === "error") && (
              <div
                className={`rounded-lg p-4 text-sm text-center ${
                  status === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-300"
                    : "bg-red-500/10 border border-red-500/30 text-red-300"
                }`}
              >
                {status === "success"
                  ? "Your email has been verified successfully. You can now log in."
                  : "Please ensure you have a valid verification link or contact support."}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailVerification;
