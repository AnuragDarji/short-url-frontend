import React, { useState, useEffect } from "react";
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

const UrlHistory = () => {
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  // Get token from localStorage or your auth context
  const getAuthToken = () => {
    return localStorage.getItem("token"); // Adjust based on your token storage
  };

  useEffect(() => {
    fetchUrlData();
  }, []);

  const fetchUrlData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://short-url-eight-beta.vercel.app/url/analytics/user/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUrlData(response.data);
    } catch (err) {
      console.error("Error fetching URL data:", err);
      setError(err.response?.data?.message || "Failed to fetch URL data");
    } finally {
      setLoading(false);
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
    const shortUrl = `${window.location.origin}/${shortId}`;
    navigator.clipboard.writeText(shortUrl);
    // You could add a toast notification here for feedback
  };

  const filteredUrls =
    urlData?.urls?.filter((url) => {
      const matchesSearch =
        url.redirectUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.shortId.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterOption === "all") return matchesSearch;
      if (filterOption === "high")
        return matchesSearch && url.totalClicks >= 10;
      if (filterOption === "low") return matchesSearch && url.totalClicks < 10;

      return matchesSearch;
    }) || [];

  if (error) {
    return (
      <div className="p-6 text-center">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-400 text-lg font-medium mb-2">Error</p>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button
                onClick={fetchUrlData}
                className="bg-blue-600 hover:bg-blue-700"
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
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-blue-400" />
            URL Analytics History
          </h1>
          <p className="text-gray-400 mt-1">
            Track and analyze your shortened URLs
          </p>
        </div>

        <Button
          onClick={fetchUrlData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-900 border-gray-700 mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by URL or short ID..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {filterOption === "all"
                    ? "All Clicks"
                    : filterOption === "high"
                    ? "High Clicks"
                    : "Low Clicks"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer"
                  onClick={() => setFilterOption("all")}
                >
                  All Clicks
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer"
                  onClick={() => setFilterOption("high")}
                >
                  High Clicks (10+)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-gray-700 focus:text-white cursor-pointer"
                  onClick={() => setFilterOption("low")}
                >
                  Low Clicks (10-)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              className="bg-gray-900 border-gray-700 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 bg-gray-800 mb-2" />
                      <Skeleton className="h-4 w-64 bg-gray-800 mb-4" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-20 bg-gray-800" />
                        <Skeleton className="h-5 w-20 bg-gray-800" />
                        <Skeleton className="h-5 w-20 bg-gray-800" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-24 bg-gray-800 rounded-md" />
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
              className="bg-gray-900 border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
            >
              <CardContent className="p-0">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <LinkIcon className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">
                            https://short-url-eight-beta.vercel.app/{url.shortId}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">
                            {url.redirectUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-300">
                          <MousePointerClick className="h-4 w-4 mr-1 text-blue-400" />
                          <span>{url.totalClicks} clicks</span>
                        </div>
                        {url.analytics.length > 0 && (
                          <div className="flex items-center text-sm text-gray-300">
                            <Clock className="h-4 w-4 mr-1 text-blue-400" />
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
                              className="h-9 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
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
                              className="h-9 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                              asChild
                            >
                              <a
                                href={`${window.location.origin}/${url.shortId}`}
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
                        Recent Clicks
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {url.analytics.slice(0, 3).map((click) => (
                          <div
                            key={click._id}
                            className="bg-gray-800/50 p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-white">
                                  {formatDate(click.timestamp)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatTime(click.timestamp)}
                                </p>
                              </div>
                              <Shield className="h-4 w-4 text-green-400 flex-shrink-0" />
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
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm ? "No matching URLs found" : "No URLs found"}
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search term or filter"
                : "You haven't created any shortened URLs yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlHistory;
