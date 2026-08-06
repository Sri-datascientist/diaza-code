import { QueryClient, QueryFunction } from "@tanstack/react-query";

// API URLs
const LAMBDA_URL = 'https://rmhwzi3xwas3faq3nl7y6w3ayi0zjjxw.lambda-url.ap-south-1.on.aws';
//const LAMBDA_URL = 'http://127.0.0.1:8000'; // Local backend for development


// Get API base URL - use local backend or Lambda URL
export function getApiBaseUrl(): string {
  // Check for environment variable override first
  const envApiUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envApiUrl) {
    console.log('🌐 Using API URL from environment:', envApiUrl);
    return envApiUrl;
  }
  
  // Use configured backend URL (local or Lambda)
  console.log('🌐 Using backend URL:', LAMBDA_URL);
  return LAMBDA_URL;
}

// Get JWT token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set JWT token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Remove JWT token from localStorage
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add base URL from environment
  let fetchUrl = url;
  if (url.startsWith('/api/')) {
    fetchUrl = `${getApiBaseUrl()}${url}`;
  }

  const res = await fetch(fetchUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const [url, ...params] = queryKey;
    let fetchUrl = url as string;
    
    // Add base URL from environment
    if (typeof url === 'string' && url.startsWith('/api/')) {
      fetchUrl = `${getApiBaseUrl()}${url}`;
    }
    
    // Add query parameters for different API endpoints
    if (params.length > 0 && params[0] && typeof url === 'string') {
      if (url.includes('/api/drive/')) {
        fetchUrl = `${fetchUrl}?folderId=${String(params[0])}`;
      } else if (url.includes('/api/public/s3/images') || url.includes('/api/admin/s3/images')) {
        fetchUrl = `${fetchUrl}?folder_path=${encodeURIComponent(String(params[0]))}`;
      }
    }

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(fetchUrl, {
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (res.status === 401 && window.location.pathname.startsWith('/admin')) {
      // Token expired or invalid, clear it and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized - redirecting to login');
    }
    
    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Global error handler for 401 errors
queryClient.setMutationDefaults(['logout'], {
  onError: (error: any) => {
    if (error.message?.includes('401')) {
      // Token expired or invalid, clear it and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
  },
});

// Global error handling is done in the query function itself
// The getQueryFn already handles 401 errors by throwing them
// Individual components can handle these errors as needed






