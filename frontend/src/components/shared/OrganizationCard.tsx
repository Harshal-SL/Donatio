import { Link } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { Organization } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrganizationCardProps {
  organization: Organization;
  className?: string;
}

const categoryColors: Record<string, string> = {
  education: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  healthcare: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
  environment: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  "animal-welfare": "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  "poverty-relief": "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  "disaster-relief": "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  "elderly-care": "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  other: "bg-muted text-muted-foreground",
};

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  className,
}) => {
  const categoryStyle = categoryColors[organization.category] || categoryColors.other;

  return (
    <div className={cn("card-hover group overflow-hidden", className)}>
      <div className="relative h-28 overflow-hidden">
        <img
          src={organization.bannerUrl}
          alt={organization.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <img
            src={organization.logoUrl}
            alt={`${organization.name} logo`}
            loading="lazy"
            className="w-12 h-12 rounded-lg border-2 border-card object-cover shadow-sm"
          />
        </div>
      </div>

      <div className="p-4 pt-8">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-foreground leading-tight line-clamp-1">
            {organization.name}
          </h3>
          <span className={cn("shrink-0 px-2 py-0.5 text-xs font-medium rounded capitalize", categoryStyle)}>
            {organization.category.replace("-", " ")}
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{organization.location}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3.5">
          {organization.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{organization.totalDonations} donations</span>
          </div>

          <Link to={`/org/${organization.id}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
              View Details
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
