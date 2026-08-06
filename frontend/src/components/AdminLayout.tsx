import { useQuery } from "@tanstack/react-query";
import { useLocation, Link, Redirect } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Users, Image, FileText, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data, isLoading } = useQuery<AdminUser | null>({
    queryKey: ["/api/admin/auth/me"],
    queryFn: async ({ queryKey }) => {
      const [url] = queryKey;
      let fetchUrl = url as string;
      
      // Add base URL using the same logic as queryClient
      if (typeof url === 'string' && url.startsWith('/api/')) {
        const envApiUrl = (import.meta as any).env?.VITE_API_BASE_URL;
        const baseUrl = envApiUrl || 'https://rmhwzi3xwas3faq3nl7y6w3ayi0zjjxw.lambda-url.ap-south-1.on.aws';
        fetchUrl = `${baseUrl}${url}`;
      }
      
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(fetchUrl, {
        headers,
      });

      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${res.status}: ${errorText}`);
      }
      
      return await res.json();
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/auth/logout");
      // Remove token from localStorage
      localStorage.removeItem('auth_token');
      queryClient.invalidateQueries({ queryKey: ["/api/admin/auth/me"] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation("/admin/login");
    } catch (error) {
      // Even if logout API fails, clear the token locally
      localStorage.removeItem('auth_token');
      queryClient.invalidateQueries({ queryKey: ["/api/admin/auth/me"] });
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
      setLocation("/admin/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFAEF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto mb-4"></div>
          <p className="text-[#3D3D3D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <Redirect to="/admin/login" />;
  }

  const navigationItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/leads", icon: Users, label: "Leads" },
    { href: "/admin/portfolio", icon: Image, label: "Portfolio" },
    { href: "/admin/seo", icon: FileText, label: "SEO" },
  ];

  return (
    <div className="flex h-screen bg-[#FFFAEF]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#E5D5C3]">
        <div className="p-6 border-b border-[#E5D5C3]">
          <h1 className="text-2xl font-playfair text-[#8B7355]">Di-Aza Admin</h1>
          <p className="text-sm text-[#3D3D3D] mt-1">{data.username}</p>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    data-testid={`nav-${item.label.toLowerCase()}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#8B7355] text-white"
                        : "text-[#3D3D3D] hover:bg-[#F5EBE0]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator className="bg-[#E5D5C3]" />

        <div className="p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 border-[#E5D5C3] hover:bg-[#F5EBE0]"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5D5C3] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-playfair text-[#8B7355]">Di-Aza Admin</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white">
          <div className="pt-20 px-4 pb-4">
            <p className="text-sm text-[#3D3D3D] mb-4">{data.username}</p>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#8B7355] text-white"
                          : "text-[#3D3D3D] hover:bg-[#F5EBE0]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <Separator className="my-4 bg-[#E5D5C3]" />
            <Button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full justify-start gap-3 border-[#E5D5C3] hover:bg-[#F5EBE0]"
              data-testid="button-mobile-logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="lg:p-8 p-4 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
