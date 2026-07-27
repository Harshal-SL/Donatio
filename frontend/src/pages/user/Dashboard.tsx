import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { OrganizationCard } from "@/components/shared/OrganizationCard";
import { CardSkeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { orgService } from "@/services/orgService";
import { userService } from "@/services/userService";
import { Organization, User } from "@/types";

const Dashboard = () => {
  const { user: authUser, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(authUser);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNearbyOnly, setShowNearbyOnly] = useState(true);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "environment", label: "Environment" },
    { value: "animal-welfare", label: "Animal Welfare" },
    { value: "elderly-care", label: "Elderly Care" },
  ];

  useEffect(() => {
    const fetchUserAndOrganizations = async () => {
      setIsLoading(true);
      try {
        const profile = await userService.getProfile();
        setUserProfile(profile);
        updateUser(profile);

        const data = await orgService.getOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || org.category === selectedCategory;

    const matchesLocation = !showNearbyOnly ||
      !userProfile?.location ||
      org.location?.toLowerCase().includes(userProfile.location.toLowerCase()) ||
      userProfile.location.toLowerCase().includes(org.location?.toLowerCase() || '');

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
            Welcome back, {userProfile?.name?.split(" ")[0] || "Donor"}!
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{userProfile?.location || "Loading location..."}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <label htmlFor="dashboard-search" className="sr-only">Search organizations</label>
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <label htmlFor="dashboard-category" className="sr-only">Category</label>
            <select
              id="dashboard-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-base pl-10 pr-8 appearance-none bg-card cursor-pointer min-w-[160px]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <label htmlFor="dashboard-location" className="sr-only">Location</label>
            <select
              id="dashboard-location"
              value={showNearbyOnly ? "nearby" : "all"}
              onChange={(e) => setShowNearbyOnly(e.target.value === "nearby")}
              className="input-base pl-10 pr-8 appearance-none bg-card cursor-pointer min-w-[150px]"
            >
              <option value="nearby">Nearby Only</option>
              <option value="all">All Locations</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            {showNearbyOnly ? 'Nearby Organizations' : 'All Organizations'} ({filteredOrganizations.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : hasError ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Failed to load</h3>
            <p className="text-sm text-muted-foreground">Could not load organizations. Please try again later.</p>
          </div>
        ) : filteredOrganizations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrganizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No organizations found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </PageLayout>
    </div>
  );
};

export default Dashboard;
