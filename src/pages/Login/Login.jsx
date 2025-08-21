// src/components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import toast from "react-hot-toast";
import { Eye, EyeOff, Sparkles, LogIn } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Signing in...");

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Login successful! Welcome back!");

        setFormData({
          email: "",
          password: "",
          rememberMe: false,
        });

        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 1000);
      } else {
        toast.dismiss(loadingToast);
        toast.error("Login failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            style={{
              width: Math.floor(Math.random() * 150) + 80,
              height: Math.floor(Math.random() * 150) + 80,
              top: `${Math.floor(Math.random() * 100)}%`,
              left: `${Math.floor(Math.random() * 100)}%`,
              animation: `float ${
                Math.floor(Math.random() * 12) + 8
              }s infinite ease-in-out`,
              animationDelay: `${Math.floor(Math.random() * 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm space-y-5 relative z-10">
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50 relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-purple-500/10 blur-xl"></div>

          <div className="flex flex-col items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mb-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Short.ly
            </h1>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm">
              Sign in to access your shortened URLs & analytics
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-300 text-sm font-medium"
              >
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="bg-gray-700/50 border-gray-600 text-white h-10 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-gray-300 text-sm font-medium"
                >
                  Password
                </Label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="bg-gray-700/50 border-gray-600 text-white h-10 text-sm pr-9 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, rememberMe: checked }))
                }
                className="data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="rememberMe" className="text-gray-300 text-xs">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <LogIn size={16} className="mr-2" />
                  Sign in
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            Don’t have an account?{" "}
            <Link
              to={ROUTES.SIGNUP}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
            Terms
          </span>{" "}
          &{" "}
          <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
            Privacy
          </span>
          .
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(5px, 5px) rotate(1deg);
          }
          50% {
            transform: translate(10px, 0px) rotate(0deg);
          }
          75% {
            transform: translate(5px, -5px) rotate(-1deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
