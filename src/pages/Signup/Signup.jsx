import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constant/routes";

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

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...");

    try {
      // Prepare payload
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      };

      // API call
      const response = await axios.post(
        "https://short-url-eight-beta.vercel.app/api/signup",
        payload
      );

      console.log("Signup response:", response);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully!", {
          description:
            response.data.msg ||
            "Your account has been created. You can now sign in.",
        });
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      console.error("Signup error:", error);

      // Error handling
      let errorMessage = "An error occurred during signup. Please try again.";

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        // Request was made but no response received
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-center" richColors closeButton />
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Create an account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your details to create your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  type="text"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email address
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters with one uppercase and one number
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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
              <Label
                htmlFor="agreeToTerms"
                className="text-gray-700 dark:text-gray-300"
              >
                I agree to the Terms and Conditions
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-primary hover:underline dark:text-primary-400"
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
