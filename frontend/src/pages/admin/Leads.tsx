import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ContactLead } from "@shared/schema";
import { format } from "date-fns";
import { Eye } from "lucide-react";

type LeadsResponse = ContactLead[];

export default function AdminLeads() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [updatedNotes, setUpdatedNotes] = useState<string>("");

  const { data, isLoading } = useQuery<LeadsResponse>({
    queryKey: ["/api/admin/leads", statusFilter !== "all" ? statusFilter : undefined],
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/admin/leads/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({
        title: "Lead updated",
        description: "Lead has been successfully updated.",
      });
      setIsDialogOpen(false);
      setSelectedLead(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead",
        variant: "destructive",
      });
    },
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

  const openLeadDialog = (lead: ContactLead) => {
    setSelectedLead(lead);
    setUpdatedStatus(lead.status);
    setUpdatedNotes(lead.notes || "");
    setIsDialogOpen(true);
  };

  const handleUpdateLead = () => {
    if (!selectedLead) return;

    updateLeadMutation.mutate({
      id: selectedLead.id,
      updates: {
        status: updatedStatus,
        notes: updatedNotes,
      },
    });
  };

  const filteredLeads = statusFilter === "all" 
    ? data || [] 
    : data?.filter(lead => lead.status === statusFilter) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair text-[#8B7355] mb-2" data-testid="text-leads-title">
              Leads Management
            </h1>
            <p className="text-[#3D3D3D]">Manage and track contact form submissions</p>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="text-[#3D3D3D]">Filter:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-[180px] border-[#E5D5C3]" data-testid="select-status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-[#E5D5C3] bg-white">
          <CardHeader>
            <CardTitle className="text-[#8B7355] font-playfair">All Leads</CardTitle>
            <CardDescription className="text-[#3D3D3D]">
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredLeads.length > 0 ? (
              <>
                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-3">
                  {filteredLeads.map((lead) => (
                    <Card key={lead.id} className="border-[#E5D5C3] bg-[#FFFAEF]" data-testid={`card-lead-${lead.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#3D3D3D] truncate">
                              {lead.first_name} {lead.last_name}
                            </p>
                            <p className="text-sm text-[#666] truncate">{lead.email}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(lead.status)} className="ml-2 flex-shrink-0" data-testid={`badge-status-${lead.id}`}>
                            {lead.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#3D3D3D] mb-2 line-clamp-2">{lead.subject}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-[#666]">
                            {format(new Date(lead.created_at), "MMM d, yyyy")}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openLeadDialog(lead)}
                            className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                            data-testid={`button-view-${lead.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#E5D5C3]">
                        <TableHead className="text-[#3D3D3D]">Name</TableHead>
                        <TableHead className="text-[#3D3D3D]">Email</TableHead>
                        <TableHead className="text-[#3D3D3D]">Subject</TableHead>
                        <TableHead className="text-[#3D3D3D]">Status</TableHead>
                        <TableHead className="text-[#3D3D3D] hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-[#3D3D3D]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id} className="border-[#E5D5C3]" data-testid={`row-lead-${lead.id}`}>
                          <TableCell className="text-[#3D3D3D] font-medium">
                            {lead.first_name} {lead.last_name}
                          </TableCell>
                          <TableCell className="text-[#3D3D3D]">
                            {lead.email}
                          </TableCell>
                          <TableCell className="text-[#3D3D3D] max-w-[200px] truncate">
                            {lead.subject}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(lead.status)} data-testid={`badge-status-${lead.id}`}>
                              {lead.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#3D3D3D] hidden lg:table-cell">
                            {format(new Date(lead.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openLeadDialog(lead)}
                              className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                              data-testid={`button-view-${lead.id}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <p className="text-center text-[#3D3D3D] py-8">
                No leads found{statusFilter !== "all" && ` with status "${statusFilter}"`}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-[#E5D5C3]">
          <DialogHeader>
            <DialogTitle className="text-[#8B7355] font-playfair">Lead Details</DialogTitle>
            <DialogDescription className="text-[#3D3D3D]">
              View and update lead information
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#3D3D3D] text-sm font-medium">First Name</Label>
                  <p className="text-[#3D3D3D] mt-1" data-testid="text-lead-firstname">{selectedLead.first_name}</p>
                </div>
                <div>
                  <Label className="text-[#3D3D3D] text-sm font-medium">Last Name</Label>
                  <p className="text-[#3D3D3D] mt-1" data-testid="text-lead-lastname">{selectedLead.last_name}</p>
                </div>
              </div>

              <div>
                <Label className="text-[#3D3D3D] text-sm font-medium">Email</Label>
                <p className="text-[#3D3D3D] mt-1" data-testid="text-lead-email">{selectedLead.email}</p>
              </div>

              <div>
                <Label className="text-[#3D3D3D] text-sm font-medium">Subject</Label>
                <p className="text-[#3D3D3D] mt-1" data-testid="text-lead-subject">{selectedLead.subject}</p>
              </div>

              <div>
                <Label className="text-[#3D3D3D] text-sm font-medium">Message</Label>
                <p className="text-[#3D3D3D] mt-1 whitespace-pre-wrap" data-testid="text-lead-queries">{selectedLead.queries}</p>
              </div>

              <div>
                <Label className="text-[#3D3D3D] text-sm font-medium">Submitted</Label>
                <p className="text-[#3D3D3D] mt-1">{format(new Date(selectedLead.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
              </div>

              <div>
                <Label htmlFor="lead-status" className="text-[#3D3D3D] text-sm font-medium">Status</Label>
                <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
                  <SelectTrigger id="lead-status" className="mt-1 border-[#E5D5C3]" data-testid="select-lead-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5D5C3]">
                    <SelectItem value="new" className="hover:bg-[#F5EBE0] focus:bg-[#F5EBE0]">New</SelectItem>
                    <SelectItem value="contacted" className="hover:bg-[#F5EBE0] focus:bg-[#F5EBE0]">Contacted</SelectItem>
                    <SelectItem value="in_progress" className="hover:bg-[#F5EBE0] focus:bg-[#F5EBE0]">In Progress</SelectItem>
                    <SelectItem value="closed" className="hover:bg-[#F5EBE0] focus:bg-[#F5EBE0]">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lead-notes" className="text-[#3D3D3D] text-sm font-medium">Notes</Label>
                <Textarea
                  id="lead-notes"
                  value={updatedNotes}
                  onChange={(e) => setUpdatedNotes(e.target.value)}
                  className="mt-1 border-[#E5D5C3] min-h-[100px]"
                  placeholder="Add notes about this lead..."
                  data-testid="textarea-lead-notes"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#E5D5C3]"
                  data-testid="button-cancel-update"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateLead}
                  disabled={updateLeadMutation.isPending}
                  className="bg-[#8B7355] hover:bg-[#6F5A44] text-white"
                  data-testid="button-save-update"
                >
                  {updateLeadMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
