import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getApiBaseUrl } from "../lib/queryClient";

// Simple UUID generator (avoiding external dependency)
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create visitor ID (stored in localStorage)
function getVisitorId(): string {
  let visitorId = localStorage.getItem("analytics_visitor_id");
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem("analytics_visitor_id", visitorId);
  }
  return visitorId;
}

// Get or create session ID (stored in sessionStorage)
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

// Track a page view event
async function trackPageView(route: string) {
  console.log("Analytics: Tracking page view for route:", route);
  try {
    // Use the same base URL logic as queryClient
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/public/analytics/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "omit" is default, but explicit for clarity
      body: JSON.stringify({
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        route,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        event_type: "page_view",
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Analytics tracking failed:", response.status, errorText);
    }
  } catch (error) {
    // Fail silently - analytics shouldn't break the app
    console.error("Analytics tracking error:", error);
  }
}

// Hook to track page views automatically
export function useAnalytics() {
  const [location] = useLocation();
  const previousLocation = useRef<string>("");

  useEffect(() => {
    // Only track if location changed
    if (location !== previousLocation.current) {
      previousLocation.current = location;
      trackPageView(location);
    }
  }, [location]);
}
