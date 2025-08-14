import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Loader2 } from "lucide-react";
import axios from "axios";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("https://example.com");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setShortUrl(""); // ✅ Hide old link before loading
    setCopied(false); // ✅ Reset copy state

    try {
      const response = await axios.post(
        "https://short-url-delta-eight.vercel.app/url/",
        { url: originalUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShortUrl(
        `https://short-url-delta-eight.vercel.app/${response.data.id}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-md max-h-[90vh] overflow-auto p-6 bg-white rounded-lg shadow-md transition-all">
      <h1 className="text-2xl font-bold text-center mb-6">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="url"
            value={originalUrl}
            onChange={(e) => {
              setOriginalUrl(e.target.value);
              setError("");
            }}
            placeholder="Enter your long URL"
            className="w-full"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            "Shorten URL"
          )}
        </Button>
      </form>

      <div className="mt-6">
        {isLoading && (
          <div className="p-4 bg-gray-50 rounded-md animate-pulse">
            <p className="text-sm text-gray-400">Generating short link...</p>
          </div>
        )}

        {!isLoading && shortUrl && (
          <div className="p-4 bg-gray-50 rounded-md transition-all">
            <p className="text-sm text-gray-500 mb-2">Your shortened URL:</p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {shortUrl}
              </a>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!shortUrl} // ✅ Disable until link exists
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="mt-2 text-xs text-green-500">
                Copied to clipboard!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
