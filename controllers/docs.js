async function handleGetApiDocs(req, res) {
  res.json({
    name: "URL Shortener API",
    description: "A simple URL shortening service with analytics",
    version: "1.0.0",
    endpoints: {
      "POST /url": {
        description: "Create a new shortened URL",
        requestBody: {
          url: "string (required) - The original URL to shorten",
          shortId: "string (optional) - Custom short ID (max 20 chars)",
          expiresAt: "ISO 8601 date (optional) - Expiration date",
          isActive: "boolean (optional, default: true) - Whether the link is active"
        },
        exampleRequest: {
          url: "https://example.com",
          shortId: "my-custom-id",
          expiresAt: "2025-12-31T23:59:59Z",
          isActive: true
        },
        response: {
          shortId: "string - The generated or custom short ID",
          redirectURL: "string - The original URL",
          isActive: "boolean - Whether the link is active",
          expiresAt: "ISO 8601 date or null - Expiration date",
          createdAt: "ISO 8601 date - Creation timestamp"
        }
      },
      "GET /:shortId": {
        description: "Redirect to the original URL",
        parameters: {
          shortId: "string - The short ID to redirect"
        },
        response: {
          "302": "Redirects to the original URL",
          "400": "Bad Request - Short URL not found or invalid",
          "410": "Gone - Link is deactivated or expired"
        }
      },
      "GET /analytics/:shortId": {
        description: "Get analytics for a shortened URL",
        parameters: {
          shortId: "string - The short ID to get analytics for"
        },
        response: {
          totalClicks: "number - Total number of clicks",
          analytics: "array - Detailed visit history",
          dailyStats: "object - Clicks grouped by day",
          avgDailyClicks: "number - Average clicks per day",
          isActive: "boolean - Whether the link is active",
          expiresAt: "ISO 8601 date or null - Expiration date",
          lastAccessed: "ISO 8601 date or null - Last access time",
          createdAt: "ISO 8601 date - Creation timestamp",
          redirectURL: "string - The original URL"
        }
      }
    },
    rateLimits: {
      "URL Generation": "100 requests per 15 minutes per IP",
      "Redirection": "1000 requests per 15 minutes per IP"
    }
  });
}

export { handleGetApiDocs };