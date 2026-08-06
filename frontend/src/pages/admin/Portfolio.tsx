import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Eye, FolderOpen, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface S3Image {
  id: string;
  name: string;
  s3_key: string;
  s3_url: string;
  file_name: string;
  file_type: string;
  size: number;
  project: string;
  room_type: string;
  is_edited: boolean;
  base_file_name: string;
}

interface S3ImagesResponse {
  images: S3Image[];
}

interface S3ProjectsResponse {
  projects: string[];
}


const portfolioItemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  isHero: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

type PortfolioItemFormValues = z.infer<typeof portfolioItemSchema>;

export default function AdminPortfolio() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");


  const { data: s3Projects } = useQuery<S3ProjectsResponse>({
    queryKey: ["/api/admin/s3/projects"],
  });

  // Set default project when S3 projects are loaded
  useEffect(() => {
    if (s3Projects?.projects && s3Projects.projects.length > 0 && !selectedProject) {
      setSelectedProject(s3Projects.projects[0]);
    }
  }, [s3Projects, selectedProject]);

  const { data: s3Images, isLoading: isLoadingS3Images } = useQuery<S3ImagesResponse>({
    queryKey: ["/api/admin/s3/images", selectedProject],
    queryFn: async () => {
      const folderPath = selectedProject 
        ? `beula/${selectedProject}`
        : "beula/";
      
      const response = await apiRequest("GET", `/api/admin/s3/images?folder_path=${encodeURIComponent(folderPath)}`);
      return response.json();
    },
    enabled: !!selectedProject,
  });

  const form = useForm<PortfolioItemFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: null,
      isHero: false,
      displayOrder: 0,
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (newItem: PortfolioItemFormValues) => {
      const response = await apiRequest("POST", "/api/admin/portfolio/items", newItem);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio/items"] });
      toast({
        title: "Portfolio item created",
        description: "The portfolio item has been successfully added.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create portfolio item",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/portfolio/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio/items"] });
      toast({
        title: "Portfolio item deleted",
        description: "The portfolio item has been successfully removed.",
      });
      setItemToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete portfolio item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PortfolioItemFormValues) => {
    createItemMutation.mutate(data);
  };

  // Filter S3 images based on search term
  const filteredS3Images = s3Images?.images?.filter(image => 
    (image.file_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (image.project?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair text-[#8B7355] mb-2" data-testid="text-portfolio-title">
              Portfolio Management
            </h1>
            <p className="text-[#3D3D3D]">Manage portfolio items and S3 images</p>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#8B7355] hover:bg-[#6F5A44] text-white"
            data-testid="button-add-portfolio-item"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio Item
          </Button>
        </div>

        {/* Portfolio Items Management */}
        <Card className="border-[#E5D5C3] bg-white">
          <CardHeader>
            <CardTitle className="text-[#8B7355] font-playfair">Portfolio Items ({filteredS3Images.length})</CardTitle>
            <CardDescription className="text-[#3D3D3D]">
              Browse and manage images from your S3 bucket
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#3D3D3D]">Project</Label>
                    <Select value={selectedProject} onValueChange={(value) => {
                      setSelectedProject(value);
                    }}>
                      <SelectTrigger className="border-[#E5D5C3]">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#E5D5C3]">
                        {s3Projects?.projects?.map((project) => (
                          <SelectItem key={project} value={project} className="hover:bg-[#F5EBE0] focus:bg-[#F5EBE0]">
                            {project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#3D3D3D]">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B7355] w-4 h-4" />
                      <Input
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-[#E5D5C3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Images Grid */}
                {isLoadingS3Images ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                  </div>
                ) : filteredS3Images.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredS3Images.map((image) => (
                      <Card key={image.id} className="border-[#E5D5C3] bg-white overflow-hidden group">
                        <div className="relative aspect-square bg-[#F5EBE0]">
                          <img
                            src={image.s3_url}
                            alt={image.file_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="bg-[#8B7355] hover:bg-[#6F5A44] text-white">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {image.is_edited && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Edited
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#8B7355] truncate" title={image.file_name}>
                              {image.file_name}
                            </p>
                            <p className="text-xs text-[#3D3D3D]">
                              {image.project}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-[#8B7355] opacity-30 mx-auto mb-4" />
                    <p className="text-[#3D3D3D] mb-2">
                      {selectedProject ? "No images found for the selected filters" : "Select a project to view images"}
                    </p>
                    {!selectedProject && (
                      <p className="text-sm text-[#3D3D3D] opacity-70">
                        Choose a project from the dropdown above to browse images
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg bg-white border-[#E5D5C3]">
          <DialogHeader>
            <DialogTitle className="text-[#8B7355] font-playfair">Add Portfolio Item</DialogTitle>
            <DialogDescription className="text-[#3D3D3D]">
              Create a new portfolio item
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter portfolio item title"
                        {...field}
                        className="border-[#E5D5C3]"
                        data-testid="input-portfolio-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter portfolio item description"
                        {...field}
                        className="border-[#E5D5C3] min-h-[100px]"
                        data-testid="textarea-portfolio-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D3D3D]">Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-[#E5D5C3]"
                        data-testid="input-portfolio-order"
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
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-[#E5D5C3]"
                  data-testid="button-cancel-add"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createItemMutation.isPending}
                  className="bg-[#8B7355] hover:bg-[#6F5A44] text-white"
                  data-testid="button-submit-add"
                >
                  {createItemMutation.isPending ? "Creating..." : "Create Item"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent className="bg-white border-[#E5D5C3]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#8B7355]">Delete Portfolio Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#3D3D3D]">
              This action cannot be undone. This will permanently delete the portfolio item and all its associated media.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E5D5C3]" data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && deleteItemMutation.mutate(itemToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-confirm-delete"
            >
              {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
