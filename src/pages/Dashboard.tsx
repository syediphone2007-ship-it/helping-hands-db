import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, MapIcon, LayoutGrid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";
import ResourceForm from "@/components/ResourceForm";
import ResourceMap from "@/components/ResourceMap";
import SearchFilters from "@/components/SearchFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = ({ user }: { user: any }) => {
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("public");
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [deleteResource, setDeleteResource] = useState<any>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceType, setResourceType] = useState("all");
  const [status, setStatus] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRole();
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, resourceType, status]);

  const fetchUserRole = async () => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResources(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (resourceType !== "all") {
      filtered = filtered.filter((r) => r.resource_type === resourceType);
    }

    if (status !== "all") {
      filtered = filtered.filter((r) => r.status === status);
    }

    setFilteredResources(filtered);
  };

  const handleCreateResource = async (data: any) => {
    try {
      const { error } = await supabase.from("resources").insert([
        {
          ...data,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource created successfully",
      });

      setShowForm(false);
      fetchResources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateResource = async (data: any) => {
    try {
      const { error } = await supabase
        .from("resources")
        .update(data)
        .eq("id", editingResource.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource updated successfully",
      });

      setShowForm(false);
      setEditingResource(null);
      fetchResources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteResource = async () => {
    if (!deleteResource) return;

    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", deleteResource.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });

      setDeleteResource(null);
      fetchResources();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const canEdit = userRole === "admin" || userRole === "volunteer";
  const canDelete = userRole === "admin";

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">Resources Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Manage disaster relief resources and view their locations
            </p>
          </div>
          {user && (
            <Button
              onClick={() => {
                setEditingResource(null);
                setShowForm(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          )}
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resourceType={resourceType}
          onResourceTypeChange={setResourceType}
          status={status}
          onStatusChange={setStatus}
        />

        <Tabs defaultValue="grid" className="mt-6">
          <TabsList>
            <TabsTrigger value="grid" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapIcon className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={
                      canEdit
                        ? () => {
                            setEditingResource(resource);
                            setShowForm(true);
                          }
                        : undefined
                    }
                    onDelete={
                      canDelete
                        ? () => setDeleteResource(resource)
                        : undefined
                    }
                    onViewMap={() => setSelectedResourceId(resource.id)}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <div className="rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <ResourceMap
                resources={filteredResources}
                selectedResourceId={selectedResourceId}
                onMarkerClick={setSelectedResourceId}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? "Edit Resource" : "Add New Resource"}
            </DialogTitle>
            <DialogDescription>
              {editingResource
                ? "Update the resource information below"
                : "Fill in the details to add a new disaster relief resource"}
            </DialogDescription>
          </DialogHeader>
          <ResourceForm
            resource={editingResource}
            onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
            onCancel={() => {
              setShowForm(false);
              setEditingResource(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteResource}
        onOpenChange={() => setDeleteResource(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the resource "{deleteResource?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
