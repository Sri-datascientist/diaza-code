import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SeoMetadata } from "@shared/schema";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const seoFormSchema = z.object({
  routePath: z.string().min(1, "Route path is required"),
  title: z.string().min(1, "Title is required"),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

type SeoResponse = SeoMetadata[];

export default function AdminSEO() {
  const { toast } = useToast();
  const [selectedSeo, setSelectedSeo] = useState<SeoMetadata | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery<SeoResponse>({
    queryKey: ["/api/admin/seo"],
  });

  const updateSeoMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest("PUT", `/api/admin/seo/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo"] });
      toast({
        title: "SEO updated",
        description: "SEO metadata has been successfully updated.",
      });
      setIsDialogOpen(false);
      setSelectedSeo(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update SEO metadata",
        variant: "destructive",
      });
    },
  });

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      routePath: "",
      title: "",
      metaDescription: "",
      ogTitle: "",
      ogDescription: "",
    },
  });

  const openEditDialog = (seo: SeoMetadata) => {
    setSelectedSeo(seo);
    form.reset({
      routePath: seo.route_path,
      title: seo.title,
      metaDescription: seo.meta_description || "",
      ogTitle: seo.og_title || "",
      ogDescription: seo.og_description || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (formData: SeoFormValues) => {
    if (!selectedSeo) return;

    updateSeoMutation.mutate({
      id: selectedSeo.id,
      updates: {
        route_path: formData.routePath,
        title: formData.title,
        meta_description: formData.metaDescription,
        og_title: formData.ogTitle,
        og_description: formData.ogDescription,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-playfair text-[#8B7355] mb-2" data-testid="text-seo-title">
            SEO Management
          </h1>
          <p className="text-[#3D3D3D]">Manage SEO metadata for all pages</p>
        </div>

        <Card className="border-[#E5D5C3] bg-white">
          <CardHeader>
            <CardTitle className="text-[#8B7355] font-playfair">Page SEO Settings</CardTitle>
            <CardDescription className="text-[#3D3D3D]">
              Update meta titles, descriptions, and Open Graph tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data?.length ? (
              <>
                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-3">
                  {data.map((seo) => (
                    <Card key={seo.id} className="border-[#E5D5C3] bg-[#FFFAEF]" data-testid={`card-seo-${seo.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#8B7355] mb-1">
                              {seo.route_path}
                            </p>
                            <p className="text-sm text-[#3D3D3D] font-medium truncate">{seo.title}</p>
                          </div>
                        </div>
                        {seo.meta_description && (
                          <p className="text-xs text-[#666] mb-3 line-clamp-2">{seo.meta_description}</p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(seo)}
                          className="w-full border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                          data-testid={`button-edit-${seo.id}`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit SEO
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#E5D5C3]">
                        <TableHead className="text-[#3D3D3D]">Route</TableHead>
                        <TableHead className="text-[#3D3D3D]">Title</TableHead>
                        <TableHead className="text-[#3D3D3D] hidden lg:table-cell">Meta Description</TableHead>
                        <TableHead className="text-[#3D3D3D]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((seo) => (
                        <TableRow key={seo.id} className="border-[#E5D5C3]" data-testid={`row-seo-${seo.id}`}>
                          <TableCell className="text-[#3D3D3D] font-medium">
                            {seo.route_path}
                          </TableCell>
                          <TableCell className="text-[#3D3D3D] max-w-[200px] truncate">
                            {seo.title}
                          </TableCell>
                          <TableCell className="text-[#3D3D3D] max-w-[300px] truncate hidden lg:table-cell">
                            {seo.meta_description || "—"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(seo)}
                              className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                              data-testid={`button-edit-${seo.id}`}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <p className="text-center text-[#3D3D3D] py-8">No SEO metadata found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit SEO Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border-[#E5D5C3] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#8B7355] font-playfair">Edit SEO Metadata</DialogTitle>
            <DialogDescription className="text-[#3D3D3D]">
              Update SEO settings for {selectedSeo?.route_path}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="routePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Route Path</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="border-[#E5D5C3] bg-gray-50"
                        data-testid="input-route-path"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Page Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter page title"
                        {...field}
                        className="border-[#E5D5C3]"
                        data-testid="input-seo-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter meta description (recommended 150-160 characters)"
                        {...field}
                        className="border-[#E5D5C3] min-h-[80px]"
                        data-testid="textarea-meta-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ogTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Open Graph Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter OG title (for social media)"
                        {...field}
                        className="border-[#E5D5C3]"
                        data-testid="input-og-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ogDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Open Graph Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter OG description (for social media)"
                        {...field}
                        className="border-[#E5D5C3] min-h-[80px]"
                        data-testid="textarea-og-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#E5D5C3]"
                  data-testid="button-cancel-seo"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateSeoMutation.isPending}
                  className="bg-[#8B7355] hover:bg-[#6F5A44] text-white"
                  data-testid="button-save-seo"
                >
                  {updateSeoMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
