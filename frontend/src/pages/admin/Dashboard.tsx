import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Eye, Image, TrendingUp } from "lucide-react";
import { ContactLead } from "@shared/schema";
import { format } from "date-fns";

interface AnalyticsSummary {
  summary: {
    total_page_views: number;
    unique_visitors: number;
    active_sessions: number;
    top_pages: { route: string; views: number }[];
    period: {
      start: string;
      end: string;
    };
  };
}

type LeadsResponse = ContactLead[];

type PortfolioResponse = any[];

export default function AdminDashboard() {
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<AnalyticsSummary>({
    queryKey: ["/api/admin/analytics/summary"],
  });

  const { data: leadsData, isLoading: leadsLoading } = useQuery<LeadsResponse>({
    queryKey: ["/api/admin/leads"],
  });

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<PortfolioResponse>({
    queryKey: ["/api/admin/portfolio/items"],
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "in_progress":
        return "outline";
      case "closed":
        return "destructive";
      default:
        return "default";
    }
  };

  const recentLeads = leadsData?.slice(0, 5) || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-playfair text-[#8B7355] mb-2" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-[#3D3D3D]">Welcome to your admin portal</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#E5D5C3] bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3D3D3D]">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-[#8B7355]" />
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-[#8B7355]" data-testid="text-total-leads">
                  {leadsData?.length || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E5D5C3] bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3D3D3D]">Portfolio Items</CardTitle>
              <Image className="h-4 w-4 text-[#8B7355]" />
            </CardHeader>
            <CardContent>
              {portfolioLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-[#8B7355]" data-testid="text-total-portfolio">
                  {portfolioData?.length || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E5D5C3] bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3D3D3D]">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-[#8B7355]" />
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-[#8B7355]" data-testid="text-total-pageviews">
                  {analyticsData?.summary.total_page_views || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E5D5C3] bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3D3D3D]">Unique Visitors</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#8B7355]" />
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-[#8B7355]" data-testid="text-total-visitors">
                  {analyticsData?.summary.unique_visitors || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top Pages Chart */}
          <Card className="border-[#E5D5C3] bg-white">
            <CardHeader>
              <CardTitle className="text-[#8B7355] font-playfair">Top Pages</CardTitle>
              <CardDescription className="text-[#3D3D3D]">
                Page views by route
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.summary.top_pages || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C3" />
                    <XAxis dataKey="route" stroke="#3D3D3D" />
                    <YAxis stroke="#3D3D3D" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFAEF",
                        border: "1px solid #E5D5C3",
                      }}
                    />
                    <Bar dataKey="views" fill="#8B7355" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card className="border-[#E5D5C3] bg-white">
            <CardHeader>
              <CardTitle className="text-[#8B7355] font-playfair">Recent Leads</CardTitle>
              <CardDescription className="text-[#3D3D3D]">
                Latest contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentLeads.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#E5D5C3]">
                        <TableHead className="text-[#3D3D3D]">Name</TableHead>
                        <TableHead className="text-[#3D3D3D]">Status</TableHead>
                        <TableHead className="text-[#3D3D3D]">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentLeads.map((lead) => (
                        <TableRow key={lead.id} className="border-[#E5D5C3]" data-testid={`row-lead-${lead.id}`}>
                          <TableCell className="text-[#3D3D3D]">
                            {lead.first_name} {lead.last_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(lead.status)} data-testid={`badge-status-${lead.id}`}>
                              {lead.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#3D3D3D]">
                            {format(new Date(lead.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-[#3D3D3D] py-8">No leads yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
