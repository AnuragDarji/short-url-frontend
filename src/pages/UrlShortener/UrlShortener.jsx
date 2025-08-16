import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Loader2, Rocket, Link2, Sparkles } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
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

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch (err) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setIsLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

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
      setOriginalUrl("");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Rocket className="h-10 w-10 text-indigo-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">URL Shortener</h1>
        <p className="text-gray-400">
          Make your links shorter and easier to share
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="url"
              value={originalUrl}
              onChange={(e) => {
                setOriginalUrl(e.target.value);
                setError("");
              }}
              placeholder="Paste your long URL here..."
              className="w-full pl-10 py-5 text-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-6 text-md font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Shortening...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Shorten URL
            </>
          )}
        </Button>
      </form>

      <div className="mt-8">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <p className="text-sm text-indigo-300 flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your short link...
            </p>
          </motion.div>
        )}

        {!isLoading && shortUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gray-700 rounded-lg border border-gray-600"
          >
            <p className="text-sm text-gray-300 mb-2 font-medium">
              Your shortened URL:
            </p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 hover:underline break-all font-medium"
              >
                {shortUrl}
              </a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!shortUrl}
                  className="shrink-0 border-gray-600 hover:bg-gray-600"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-indigo-400" />
                  )}
                </Button>
              </motion.div>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-green-400 font-medium"
              >
                Copied to clipboard!
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UrlShortener;
