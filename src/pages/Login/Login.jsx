import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email address
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <a 
                  href="#" 
                  className="text-sm text-primary hover:underline dark:text-primary-400"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="remember-me" />
              <Label htmlFor="remember-me" className="text-gray-700 dark:text-gray-300">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:underline dark:text-primary-400">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login