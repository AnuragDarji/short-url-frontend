import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constant/routes";
import { Home, Link2, LogOut, Menu, X, Sparkles, Settings } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const avatarInitials = getInitials(user.name || "User");

  // Sample user data
  // const user = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   avatar: "JD",
  // };

  const navigationLinks = [
    { name: "Dashboard", path: ROUTES.DASHBOARD, icon: Home },
    { name: "URL History", path: ROUTES.URLHISTORY, icon: Link2 },
  ];

  const handleLogout = () => {
    // Logout logic would go here
    localStorage.clear();
    navigate(ROUTES.LOGIN, { replace: true });
    console.log("User logged out");
  };

  // Function to generate gradient based on user initials
  const getAvatarGradient = (initials) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-indigo-500 to-blue-600",
    ];

    // Simple hash function to get consistent color based on initials
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const avatarGradient = getAvatarGradient(avatarInitials);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={ROUTES.DASHBOARD}
              className="flex-shrink-0 flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-blue-500/20 rounded-lg blur-sm group-hover:bg-blue-500/30 transition-all duration-300 -z-10"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BrandName
              </h1>
            </Link>
          </div>

          {/* Right side - Navigation and user menu */}
          <div className="flex items-center">
            {/* Desktop Navigation - Right aligned */}
            <nav className="hidden md:flex md:space-x-1 mr-4">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 relative group ${
                      currentPath === link.path
                        ? "text-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-600"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>

                    {/* Hover effect */}
                    {currentPath !== link.path && (
                      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User History dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-2 h-11 w-11 rounded-full border border-gray-700 text-white transition-all duration-300 hover:border-blue-500 hover:scale-105 relative group flex items-center justify-center bg-gray-900/40 backdrop-blur-sm"
                >
                  {/* Avatar Circle */}
                  <div
                    className={`h-9 w-9 aspect-square rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow`}
                  >
                    {avatarInitials}
                  </div>

                  {/* Active indicator */}
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900 shadow-sm"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-gray-800 border-gray-700 text-white shadow-xl backdrop-blur-sm bg-opacity-95"
              >
                <DropdownMenuLabel className="bg-gray-800 p-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-medium shadow-inner`}
                      >
                        {avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  asChild
                  className="text-gray-300 focus:bg-blue-600 focus:text-white cursor-pointer py-2.5"
                >
                  <Link
                    to={ROUTES.URLHISTORY}
                    className="flex items-center w-full"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    <span>URL History</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem className="text-gray-300 focus:bg-blue-600 focus:text-white cursor-pointer py-2.5">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:text-red-300 focus:bg-red-950 cursor-pointer py-2.5"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-3 text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-700 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium gap-3 transition-all duration-200 ${
                    currentPath === link.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-inner"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile user info */}
            <div className="px-4 py-4 border-t border-gray-700/50 mt-2">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-medium shadow-lg relative`}
                >
                  {avatarInitials}
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to={ROUTES.URLHISTORY}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>URL History</span>
                </Link>
                {/* <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link> */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
