import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import { Eye, EyeOff } from "lucide-react"; // 👈 icons for show/hide password

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Terms not accepted", {
        description: "Please agree to the terms and conditions.",
      });
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "https://short-url-eight-beta.vercel.app/api/signup",
        payload
      );

      toast.dismiss(loadingToast);

      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully!", {
          description:
            response.data.msg ||
            "Your account has been created. You can now sign in.",
        });
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
    } catch (error) {
      toast.dismiss(loadingToast);

      let errorMessage = "An error occurred during signup. Please try again.";

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Toaster position="top-center" richColors closeButton />
      <div className="w-full max-w-md space-y-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">
              Create an account
            </h1>
            <p className="text-gray-400">
              Enter your details to create your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  type="text"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email address
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Must be at least 8 characters with one uppercase and one number
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
                }
                required
              />
              <Label htmlFor="agreeToTerms" className="text-gray-300">
                I agree to the Terms and Conditions
              </Label>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
