import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  DollarSign,
  TrendingUp,
  Shield,
  Smartphone,
  BarChart3,
  PieChart,
  Wallet,
  Star,
  ArrowRight,
  CheckCircle,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinanceLandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description:
        "AI-powered insights into your spending patterns and financial health",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description:
        "256-bit encryption and multi-factor authentication keep your data safe",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Cross-Platform Sync",
      description:
        "Access your finances anywhere with seamless device synchronization",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      description:
        "Get alerts for unusual spending, bill reminders, and budget limits",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      text: "Finally got my finances under control. The insights are game-changing!",
    },
    {
      name: "Mike Chen",
      role: "Freelancer",
      text: "The budgeting tools helped me save $5,000 in just 6 months.",
    },
    {
      name: "Lisa Rodriguez",
      role: "Financial Advisor",
      text: "I recommend this to all my clients. It's incredibly comprehensive.",
    },
  ];

  const stats = [
    { number: "5K+", label: "Active Users" },
    { number: "$1M+", label: "Tracked Transactions" },
    { number: "4.8/5", label: "App Store Rating" },
    { number: "99.9%", label: "Uptime" },
  ];

  const handleGetStarted = () => {
    navigate("/login"); // Correct navigation without auto-login
  };

  const handleDemo = () => {
    window.open("https://financedemo-phi.vercel.app/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div
          className={`relative z-10 max-w-6xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-green p-3 rounded-2xl mr-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              FinanceTracker
            </h1>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Master Your Money,
            <br />
            <span className="text-transparent bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text">
              Master Your Future
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The most intelligent finance app that transforms chaos into clarity.
            Track, analyze, and optimize your financial life with AI-powered
            insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              type="button"
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-emerald-600 to-black hover:from-emerald-700 hover:to-green-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 flex items-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleDemo}
              className="group border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/10 flex items-center"
            >
              Demo
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-white bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powerful Features
          </h3>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to take complete control of your financial
            journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:bg-white/10"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h4>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose FinanceTracker Pro?
            </h3>
            <div className="space-y-6">
              {[
                "Real-time expense tracking with automatic categorization",
                "Advanced budgeting tools with smart spending alerts",
                "Investment portfolio tracking and performance analysis",
                "Bill reminders and subscription management",
                "Goal setting with progress visualization",
                "Comprehensive financial reports and insights",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-emerald-600 to-black p-8 rounded-3xl backdrop-blur-sm border border-white/10 space-y-4">
            <div className="bg-white/10 p-4 rounded-xl flex justify-between">
              <span className="text-gray-300">Monthly Income</span>
              <span className="text-green-400 font-bold">+$5,250</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex justify-between">
              <span className="text-gray-300">Total Expenses</span>
              <span className="text-red-400 font-bold">-$3,180</span>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex justify-between">
              <span className="text-gray-300">Savings</span>
              <span className="text-blue-400 font-bold">$2,070</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Loved by Thousands
          </h3>
          <div className="flex justify-center items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <p className="text-gray-300 mb-4 italic">"{t.text}"</p>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-gray-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-gray-400">
        <p>&copy; 2025 FinanceTracker Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FinanceLandingPage;
