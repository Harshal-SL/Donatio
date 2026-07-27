import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Package, Truck, Calendar, Clock, FileText, CheckCircle, XCircle, Award, Gift } from "lucide-react";
import { OrgNavbar } from "@/components/shared/OrgNavbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { getOrgDonationById } from "@/services/orgBackendService";
import { donationService } from "@/services/donationService";
import { Donation } from "@/types";
import { toast } from "sonner";

const OrgDonationDetail = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rewardPoints, setRewardPoints] = useState("");
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) return;
      setIsLoading(true);
      try {
        const response = await getOrgDonationById(donationId);
        if (response.success && response.data) {
          const backendData = response.data;
          const transformedDonation: Donation = {
            id: backendData.id,
            donorId: backendData.donor_id,
            donorName: backendData.user_profiles?.name || 'Unknown Donor',
            organizationId: backendData.organization_id,
            organizationName: 'Your Organization',
            type: backendData.donation_type || 'items',
            quantity: backendData.quantity || backendData.item_description || 'N/A',
            deliveryMethod: backendData.delivery_method || 'dropoff',
            preferredDate: backendData.preferred_date || backendData.created_at,
            preferredTime: backendData.preferred_time || '10:00 AM',
            notes: backendData.notes || backendData.description || '',
            status: backendData.status,
            rewardPoints: backendData.reward_points,
            certificateUrl: backendData.certificate_url,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at || backendData.created_at
          };
          setDonation(transformedDonation);
        } else {
          setDonation(null);
        }
      } catch (error) {
        console.error("Error fetching donation:", error);
        toast.error("Failed to load donation details");
        setDonation(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonation();
  }, [donationId]);

  const handleStatusUpdate = async (status: "accepted" | "rejected") => {
    if (!donation) return;
    setIsUpdating(true);
    try {
      const updated = await donationService.updateDonationStatus(donation.id, status);
      setDonation(updated);
      toast.success(`Donation ${status}!`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComplete = async () => {
    if (!donation || !rewardPoints) {
      toast.error("Please enter reward points");
      return;
    }
    setIsUpdating(true);
    try {
      const updated = await donationService.updateDonationStatus(
        donation.id,
        "completed",
        parseInt(rewardPoints)
      );
      setDonation(updated);
      toast.success("Donation completed! Certificate generated.");
      setShowCompleteForm(false);
    } catch (error) {
      toast.error("Failed to complete donation");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <OrgNavbar />
        <PageLayout>
          <Skeleton className="h-6 w-1/3 mb-5" />
          <Skeleton className="h-64 w-full" />
        </PageLayout>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <OrgNavbar />
        <PageLayout>
          <div className="text-center py-12">
            <h2 className="text-lg font-bold text-foreground mb-3">Donation not found</h2>
            <Link to="/org/dashboard"><Button><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Button></Link>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OrgNavbar />
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              to="/org/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-foreground">Donation Request</h1>
              <StatusBadge status={donation.status} />
            </div>
          </div>

          <div className="card-base p-5 mb-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Donor Information</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{donation.donorName}</p>
                <p className="text-xs text-muted-foreground">Donor ID: {donation.donorId}</p>
              </div>
            </div>
          </div>

          <div className="card-base p-5 mb-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Donation Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium text-foreground capitalize">{donation.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-sm font-medium text-foreground">{donation.quantity}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Method</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {donation.deliveryMethod === "pickup" ? "Pickup Requested" : "Drop-off"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Preferred Date</p>
                  <p className="text-sm font-medium text-foreground">{new Date(donation.preferredDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Preferred Time</p>
                  <p className="text-sm font-medium text-foreground">{donation.preferredTime}</p>
                </div>
              </div>
            </div>
            {donation.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm text-foreground">{donation.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {donation.status === "pending" && (
            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Actions</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => handleStatusUpdate("accepted")} disabled={isUpdating} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Accept Donation
                </Button>
                <Button onClick={() => handleStatusUpdate("rejected")} disabled={isUpdating} variant="destructive" className="flex-1">
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject
                </Button>
              </div>
            </div>
          )}

          {donation.status === "accepted" && (
            <div className="card-base p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Mark as Completed</h2>
              {showCompleteForm ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      <Award className="w-3.5 h-3.5 inline mr-1.5" />
                      Reward Points
                    </label>
                    <input
                      type="number"
                      value={rewardPoints}
                      onChange={(e) => setRewardPoints(e.target.value)}
                      className="input-base"
                      placeholder="Enter points (e.g., 100)"
                      min="1"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleComplete} disabled={isUpdating} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Complete &amp; Generate Certificate
                    </Button>
                    <Button variant="outline" onClick={() => setShowCompleteForm(false)} disabled={isUpdating}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowCompleteForm(true)} className="w-full">
                  Mark as Completed
                </Button>
              )}
            </div>
          )}

          {donation.status === "completed" && (
            <div className="card-base p-5 bg-success/5 border-success/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Donation Completed!</h2>
                  <p className="text-xs text-muted-foreground">
                    {donation.rewardPoints} points awarded &bull; Certificate generated
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </div>
  );
};

export default OrgDonationDetail;
