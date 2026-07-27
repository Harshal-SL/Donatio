import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, Calendar, Clock, FileText, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";
import { orgService } from "@/services/orgService";
import { donationService } from "@/services/donationService";
import { Organization } from "@/types";
import { toast } from "sonner";

const donationTypes = [
  { value: "food", label: "Food Items" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books & Stationery" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "medical", label: "Medical Supplies" },
  { value: "monetary", label: "Monetary" },
  { value: "other", label: "Other" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const Donate = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    quantity: "",
    deliveryMethod: "dropoff" as "pickup" | "dropoff",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.quantity || !formData.preferredDate || !formData.preferredTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!organization) return;

    setIsSubmitting(true);
    try {
      await donationService.createDonation({
        organizationId: organization.id,
        organizationName: organization.name,
        ...formData,
      });
      setShowSuccess(true);
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <Skeleton className="h-6 w-1/3 mb-5" />
          <Skeleton className="h-64 w-full" />
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLayout>
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Donation Submitted!</h1>
            <p className="text-sm text-muted-foreground mb-2">
              Your donation request has been sent to{" "}
              <span className="font-medium text-foreground">{organization.name}</span>
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium mb-6">
              <Clock className="w-3.5 h-3.5" />
              Status: Pending
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/profile"><Button variant="outline">View My Donations</Button></Link>
              <Link to="/dashboard"><Button>Continue Exploring</Button></Link>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <Link
              to={`/org/${organization.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to organization
            </Link>
            <h1 className="text-xl font-bold text-foreground">Make a Donation</h1>
          </div>

          <div className="card-base p-4 mb-5">
            <div className="flex items-center gap-3">
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs text-muted-foreground">Donating to</p>
                <p className="text-sm font-medium text-foreground">{organization.name}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-base p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <Package className="w-3.5 h-3.5 inline mr-1.5" />
                  Donation Type *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {donationTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={cn("p-2.5 rounded-lg border text-left text-sm transition-all", formData.type === type.value
                        ? "border-primary bg-primary/5 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="donate-quantity" className="block text-sm font-medium text-foreground mb-1.5">
                  Quantity / Value *
                </label>
                <input
                  id="donate-quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-base"
                  placeholder="e.g., 10 items, 5kg, $500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Truck className="w-3.5 h-3.5 inline mr-1.5" />
                  Delivery Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "dropoff", label: "I'll drop off", desc: "Deliver to organization" },
                    { value: "pickup", label: "Request pickup", desc: "Organization collects" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryMethod: option.value as "pickup" | "dropoff" })}
                      className={cn("p-3.5 rounded-lg border text-left transition-all", formData.deliveryMethod === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50")}
                    >
                      <p className="text-sm font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="donate-date" className="block text-sm font-medium text-foreground mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                    Preferred Date *
                  </label>
                  <input
                    id="donate-date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="input-base"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="donate-time" className="block text-sm font-medium text-foreground mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                    Preferred Time *
                  </label>
                  <select
                    id="donate-time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="input-base"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="donate-notes" className="block text-sm font-medium text-foreground mb-1.5">
                  <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                  Additional Notes
                </label>
                <textarea
                  id="donate-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-base min-h-[80px] resize-none"
                  placeholder="Any special instructions or details..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Donation"}
              </Button>
            </div>
          </form>
        </div>
      </PageLayout>
    </div>
  );
};

export default Donate;
