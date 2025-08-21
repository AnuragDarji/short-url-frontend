// src/components/Signup.jsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import toast from "react-hot-toast";
import { Eye, EyeOff, Sparkles, UserPlus } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match. Please try again.",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Terms not accepted", {
        description: "Please agree to the terms and conditions.",
      });
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Creating your account...");

    try {
      const result = await signup(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password
      );

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Account created successfully!", {
          description: result.message,
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        });

        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 1200);
      } else {
        toast.dismiss(loadingToast);
        toast.error("Signup failed", {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl p-6 border border-gray-700/50 relative">
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md mb-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Short.ly
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 text-sm">
              Start shortening your links in seconds
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-gray-300 text-xs mb-1.5">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  type="text"
                  className="bg-gray-700/50 border-gray-600 text-white h-9 text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300 text-xs mb-1.5">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  className="bg-gray-700/50 border-gray-600 text-white h-9 text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300 text-xs mb-1.5">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="bg-gray-700/50 border-gray-600 text-white h-9 text-sm"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 text-xs mb-1.5">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="bg-gray-700/50 border-gray-600 text-white h-9 text-sm pr-8"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 text-xs mb-1.5">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-gray-700/50 border-gray-600 text-white h-9 text-sm pr-8"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2">
              <Switch
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
                }
                className="data-[state=checked]:bg-blue-500"
                required
              />
              <Label htmlFor="agreeToTerms" className="text-gray-300 text-xs">
                I agree to{" "}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms
                </Link>
              </Label>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-9 text-sm cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : (
                <>
                  <UserPlus size={16} className="mr-1" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
