import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import { Toaster, toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "https://short-url-eight-beta.vercel.app/api/login",
        payload
      );

      toast.dismiss(loadingToast);

      if (response.status === 200 || response.status === 201) {
        toast.success("Login successful!", {
          description: "Welcome back! Redirecting to dashboard...",
        });
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });

      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1500);
    } catch (error) {
      toast.dismiss(loadingToast);

      let errorMessage = "An error occurred during login. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.response.status === 404) {
          errorMessage = "User not found. Please check your email.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error("Login failed", {
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
              Welcome back
            </h1>
            <p className="text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              />
              <Label htmlFor="rememberMe" className="text-gray-300">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to={ROUTES.SIGNUP}
              className="text-blue-400 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
