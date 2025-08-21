import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  Filter,
  Link as LinkIcon,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Search,
  Shield,
  AlertCircle,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import { Badge } from "@/components/ui/badge";
import toast, { Toaster } from "react-hot-toast";

const UrlHistory = () => {
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const navigate = useNavigate();

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    fetchUrlData();
  }, []);

  const fetchUrlData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        toast.loading("Refreshing data...");
      } else {
        setLoading(true);
      }
      setError(null);

      const token = getAuthToken();
      if (!token) {
        const errorMsg = "Authentication token not found. Please log in again.";
        setError(errorMsg);
        setLoading(false);
        setRefreshing(false);
        toast.error(errorMsg);
        navigate(ROUTES.LOGIN);
        return;
      }

      const response = await axios.get(
        "https://short-url-eight-beta.vercel.app/url/analytics/user/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      setUrlData(response.data);
      if (isRefresh) {
        toast.success("Data refreshed successfully!");
      }
    } catch (err) {
      console.error("Error fetching URL data:", err);
      const errorMessage =
        err.response?.data?.message || err.code === "ECONNABORTED"
          ? "Request timeout. Please try again."
          : "Failed to fetch URL data. Please check your connection.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (shortId) => {
    const shortUrl = `https://short-url-eight-beta.vercel.app/${shortId}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("URL copied to clipboard!");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Memoized filtered URLs for better performance
  const filteredUrls = useMemo(() => {
    if (!urlData?.urls) return [];

    return urlData.urls.filter((url) => {
      const matchesSearch =
        url.redirectUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.shortId.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterOption === "all") return matchesSearch;
      if (filterOption === "high")
        return matchesSearch && url.totalClicks >= 10;
      if (filterOption === "low") return matchesSearch && url.totalClicks < 10;
      if (filterOption === "recent") {
        // Show URLs created in the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return matchesSearch && new Date(url.createdAt) > oneWeekAgo;
      }

      return matchesSearch;
    });
  }, [urlData, searchTerm, filterOption]);

  const handleRetry = () => {
    setError(null);
    fetchUrlData();
  };

  if (error && !loading) {
    return (
      <div className="min-h-[calc(100vh-102px)] flex items-center justify-center p-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 max-w-md w-full">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <AlertCircle className="h-16 w-16 text-red-500 relative" />
              </div>
              <p className="text-red-400 text-lg font-medium mb-2">Error</p>
              <p className="text-gray-400 text-center mb-6">{error}</p>
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-102px)] p-4 md:p-6 max-w-6xl mx-auto flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-600/30 rounded-full blur-sm"></div>
              <BarChart3 className="h-7 w-7 text-blue-400 relative" />
            </div>
            URL Analytics History
          </h1>
          <p className="text-gray-400 mt-1">
            Track and analyze your shortened URLs
          </p>
        </div>

        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/20"
          >
            {urlData?.urls ? `${urlData.urls.length} URLs` : "0 URLs"}
          </Badge>
          <Button
            onClick={() => fetchUrlData(true)}
            disabled={loading || refreshing}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 mb-6 shadow-xl">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by URL or short ID..."
                className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:text-white transition-colors whitespace-nowrap"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {filterOption === "all"
                    ? "All URLs"
                    : filterOption === "high"
                    ? "High Clicks"
                    : filterOption === "low"
                    ? "Low Clicks"
                    : "Recent URLs"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white shadow-xl">
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer transition-colors"
                  onClick={() => setFilterOption("all")}
                >
                  All URLs
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer transition-colors"
                  onClick={() => setFilterOption("high")}
                >
                  High Clicks (10+)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer transition-colors"
                  onClick={() => setFilterOption("low")}
                >
                  Low Clicks (&lt;10)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer transition-colors"
                  onClick={() => setFilterOption("recent")}
                >
                  Recent URLs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <Skeleton className="h-6 w-48 bg-gray-800/50 mb-2" />
                        <Skeleton className="h-4 w-64 bg-gray-800/50 mb-4" />
                        <div className="flex items-center gap-4 flex-wrap">
                          <Skeleton className="h-5 w-20 bg-gray-800/50" />
                          <Skeleton className="h-5 w-20 bg-gray-800/50" />
                          <Skeleton className="h-5 w-20 bg-gray-800/50" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 bg-gray-800/50 rounded-md" />
                        <Skeleton className="h-9 w-9 bg-gray-800/50 rounded-md" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUrls.length > 0 ? (
          <div className="space-y-4">
            {filteredUrls.map((url) => (
              <Card
                key={url.shortId}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/5 group"
              >
                <CardContent className="p-0">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <LinkIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white truncate flex items-center gap-2">
                                https://short-url-eight-beta.vercel.app/
                                {url.shortId}
                              </h3>
                              {url.totalClicks >= 10 && (
                                <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-0">
                                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                  Popular
                                </Badge>
                              )}
                              {new Date(url.createdAt) >
                                new Date(
                                  Date.now() - 7 * 24 * 60 * 60 * 1000
                                ) && (
                                <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm truncate flex items-center mt-1">
                              <Globe className="h-3.5 w-3.5 mr-1.5 text-gray-500 flex-shrink-0" />
                              {url.redirectUrl}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 px-3 py-1.5 rounded-full">
                            <MousePointerClick className="h-4 w-4 mr-1.5 text-blue-400" />
                            <span className="font-medium">
                              {url.totalClicks} clicks
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 px-3 py-1.5 rounded-full">
                            <Calendar className="h-4 w-4 mr-1.5 text-blue-400" />
                            <span>Created: {formatDate(url.createdAt)}</span>
                          </div>
                          {url.analytics.length > 0 && (
                            <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 px-3 py-1.5 rounded-full">
                              <Clock className="h-4 w-4 mr-1.5 text-blue-400" />
                              <span>
                                Last click:{" "}
                                {formatDate(url.analytics[0].timestamp)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer h-9 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-blue-400 text-white transition-colors"
                                onClick={() => copyToClipboard(url.shortId)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                              <p>Copy short URL</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:text-blue-400 text-white transition-colors"
                                asChild
                              >
                                <a
                                  href={`https://short-url-eight-beta.vercel.app/${url.shortId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                              <p>Visit URL</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Analytics Details */}
                    {url.analytics.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <h4 className="font-medium text-gray-300 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                          Recent Clicks ({url.analytics.length} total)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {url.analytics.slice(0, 3).map((click) => (
                            <div
                              key={click._id}
                              className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 hover:border-gray-700 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-white font-medium">
                                    {formatDate(click.timestamp)}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatTime(click.timestamp)}
                                  </p>
                                  {click.referrer && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                      From: {click.referrer}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-green-500/10 p-1.5 rounded-full">
                                  <Shield className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {url.analytics.length > 3 && (
                          <p className="text-xs text-gray-500 mt-2">
                            +{url.analytics.length - 3} more clicks
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full py-12">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 max-w-md w-full text-center shadow-xl">
              <CardContent className="p-8">
                <div className="bg-blue-500/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchTerm || filterOption !== "all"
                    ? "No matching URLs found"
                    : "No URLs found"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || filterOption !== "all"
                    ? "Try adjusting your search term or filter"
                    : "You haven't created any shortened URLs yet"}
                </p>
                <Button
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  Create Your First URL
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlHistory;
