import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Edit,
  Trash2,
  Home,
  Utensils,
  Heart,
  Truck,
} from "lucide-react";

interface ResourceCardProps {
  resource: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewMap?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const ResourceCard = ({
  resource,
  onEdit,
  onDelete,
  onViewMap,
  canEdit,
  canDelete,
}: ResourceCardProps) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "shelter":
        return <Home className="h-5 w-5" />;
      case "food":
        return <Utensils className="h-5 w-5" />;
      case "medical":
        return <Heart className="h-5 w-5" />;
      case "logistics":
        return <Truck className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success text-success-foreground";
      case "limited":
        return "bg-warning text-warning-foreground";
      case "unavailable":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const occupancyPercentage = resource.capacity
    ? Math.round((resource.current_occupancy / resource.capacity) * 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              {getResourceIcon(resource.resource_type)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {resource.resource_type.replace("_", " ")}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(resource.status)}>
            {resource.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {resource.description && (
          <p className="text-sm text-foreground line-clamp-2">{resource.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{resource.location_name}</span>
          </div>

          {resource.capacity && (
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {resource.current_occupancy || 0} / {resource.capacity} ({occupancyPercentage}%)
              </span>
            </div>
          )}

          {resource.contact_phone && (
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{resource.contact_phone}</span>
            </div>
          )}

          {resource.contact_email && (
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{resource.contact_email}</span>
            </div>
          )}
        </div>

        {resource.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              Note: {resource.notes}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewMap}>
          <MapPin className="h-4 w-4 mr-1" />
          View on Map
        </Button>
        {canEdit && onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {canDelete && onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
