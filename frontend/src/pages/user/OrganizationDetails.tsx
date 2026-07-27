import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowLeft, Gift, Package } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";
import { orgService } from "@/services/orgService";
import { Organization } from "@/types";

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

const urgencyColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const OrganizationDetails = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!orgId) return;
      setIsLoading(true);
      try {
        const data = await orgService.getOrganizationById(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganization();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-8 w-1/3 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </PageLayout>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <div className="text-center py-12">
            <h2 className="text-lg font-bold text-foreground mb-3">Organization not found</h2>
            <Link to="/dashboard"><Button><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Button></Link>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-48 sm:h-56">
        <img
          src={organization.bannerUrl}
          alt={organization.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <Link
          to="/dashboard"
          className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-1.5 px-3.5 py-2 bg-background/80 backdrop-blur rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <PageLayout className="-mt-12 relative z-10">
        <div className="card-base p-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="w-16 h-16 rounded-xl border-2 border-card shadow-sm object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                {organization.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{organization.location}</span>
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded capitalize", categoryColors[organization.category] || categoryColors.other)}>{organization.category.replace("-", " ")}</span>
              </div>
            </div>
            <Link to={`/donate/${organization.id}`}>
              <Button className="w-full sm:w-auto">
                <Gift className="w-4 h-4 mr-1.5" />
                Donate Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{organization.description}</p>
            </div>

            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-2">Our Mission</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{organization.mission}</p>
            </div>

            {organization.images.length > 0 && (
              <div className="card-base p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Gallery</h2>
                <div className="grid grid-cols-2 gap-3">
                  {organization.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${organization.name} gallery ${index + 1}`}
                      loading="lazy"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Current Needs</h2>
              {organization.donationNeeds.length > 0 ? (
                <div className="space-y-3">
                  {organization.donationNeeds.map((need) => (
                    <div key={need.id} className="flex items-start gap-3 p-3.5 bg-secondary/50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-medium text-foreground">{need.title}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${urgencyColors[need.urgency]}`}>
                            {need.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{need.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No specific needs listed at the moment</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Address</p>
                    <p className="text-xs text-muted-foreground">{organization.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Phone</p>
                    <p className="text-xs text-muted-foreground">{organization.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">{organization.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Impact</h2>
              <div className="space-y-3">
                <div className="text-center p-3.5 bg-primary/5 rounded-lg">
                  <p className="text-xl font-bold text-primary">{organization.totalDonations || 0}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Donors</p>
                </div>
                <div className="text-center p-3.5 bg-accent/50 rounded-lg">
                  <p className="text-lg font-bold text-foreground">
                    {new Date().getFullYear() - new Date(organization.createdAt).getFullYear() || 0}+
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Years Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default OrganizationDetails;
