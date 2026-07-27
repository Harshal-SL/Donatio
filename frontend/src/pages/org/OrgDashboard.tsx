import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, Clock, CheckCircle, Award, ArrowRight, User } from "lucide-react";
import { OrgNavbar } from "@/components/shared/OrgNavbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getOrgDashboard, getPendingDonations, getDonationStats } from "@/services/orgBackendService";
import { Donation } from "@/types";

const OrgDashboard = () => {
  const { organization } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    totalPointsGiven: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dashboardResponse = await getOrgDashboard();

        if (dashboardResponse.success) {
          const { stats, recent_donations } = dashboardResponse.data;
          setDonations(recent_donations || []);
          setStats({
            totalDonations: stats.total_donations || 0,
            pendingDonations: stats.pending_donations || 0,
            completedDonations: stats.completed_donations || 0,
            totalPointsGiven: stats.total_points_given || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organization?.id) {
      fetchData();
    }
  }, [organization?.id]);

  const statCards = [
    { label: "Total Donations", value: stats.totalDonations, icon: Gift, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: stats.pendingDonations, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Completed", value: stats.completedDonations, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "Points Given", value: stats.totalPointsGiven, icon: Award, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <OrgNavbar />
      <PageLayout>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-0.5">
            Welcome, {organization?.name || "Organization"}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming donations and reward your donors
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading
            ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)
            : statCards.map((stat, index) => (
                <div key={stat.label} className="card-base p-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
        </div>

        <div className="card-base">
          <div className="px-5 py-3.5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Incoming Donation Requests</h2>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : donations.length > 0 ? (
            <div className="divide-y divide-border">
              {donations.map((donation) => (
                <div key={donation.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {donation.user_profiles?.name || 'Anonymous Donor'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donation.donation_type || 'N/A'} {donation.amount && `&bull; $${donation.amount}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donation.description || 'No description'} &bull; {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <StatusBadge status={donation.status} />
                    {donation.certificates?.[0]?.points_awarded && (
                      <span className="text-xs text-muted-foreground">{donation.certificates[0].points_awarded} pts</span>
                    )}
                    <Link to={`/org/donations/${donation.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View<ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">No donations yet</h3>
              <p className="text-sm text-muted-foreground">Donation requests will appear here when donors contribute</p>
            </div>
          )}
        </div>
      </PageLayout>
    </div>
  );
};

export default OrgDashboard;
