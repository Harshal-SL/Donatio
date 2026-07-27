import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Download, Award, Gift, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PointsBadge } from "@/components/shared/PointsBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { Donation, Certificate } from "@/types";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationData, certData] = await Promise.all([
          userService.getDonationHistory(),
          userService.getCertificates(),
        ]);
        setDonations(donationData);
        setCertificates(certData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDownloadCertificate = async (cert: Certificate) => {
    try {
      const certificateContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${cert.organizationName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'DM Sans', system-ui, sans-serif; padding: 40px; background: #FCFBFD; margin: 0; }
    .certificate { background: white; padding: 48px; max-width: 720px; margin: 0 auto; border-radius: 16px; border: 1px solid #E7E6ED; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .header { text-align: center; margin-bottom: 32px; }
    .title { font-size: 32px; color: #7C3AED; font-weight: 700; margin: 8px 0; letter-spacing: -0.02em; }
    .subtitle { font-size: 14px; color: #7A7685; margin-bottom: 4px; font-weight: 500; }
    .content { text-align: center; margin: 32px 0; line-height: 1.8; font-size: 16px; color: #14131C; }
    .recipient { font-size: 28px; color: #14131C; font-weight: 700; margin: 24px 0; border-bottom: 2px solid #7C3AED; display: inline-block; padding-bottom: 8px; }
    .org-name { color: #7C3AED; font-weight: 600; margin: 16px 0; }
    .details { margin: 24px 0; padding: 20px; background: #F1F0F4; border-radius: 10px; }
    .detail-item { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #E7E6ED; font-size: 14px; }
    .detail-label { color: #7A7685; }
    .detail-value { color: #14131C; font-weight: 500; }
    .footer { margin-top: 40px; text-align: center; color: #7A7685; font-size: 12px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="subtitle">Certificate of Appreciation</div>
      <div class="title">Donatio Certificate</div>
      <div class="subtitle">This certifies that</div>
    </div>
    <div class="content">
      <div class="recipient">${user?.name || 'Donor'}</div>
      <p>has generously contributed to</p>
      <h2 class="org-name">${cert.organizationName}</h2>
      <p>with their valuable donation</p>
    </div>
    <div class="details">
      <div class="detail-item"><span class="detail-label">Donation Type</span><span class="detail-value">${cert.donationType?.toUpperCase() || 'N/A'}</span></div>
      <div class="detail-item"><span class="detail-label">Certificate Number</span><span class="detail-value">${cert.certificateNumber || cert.id}</span></div>
      <div class="detail-item"><span class="detail-label">Date Issued</span><span class="detail-value">${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
      ${cert.points ? `<div class="detail-item"><span class="detail-label">Points Awarded</span><span class="detail-value">${cert.points} Points</span></div>` : ''}
    </div>
    <div class="footer"><p>Certificate ID: ${cert.id}</p></div>
  </div>
</body>
</html>`;

      const blob = new Blob([certificateContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${cert.organizationName.replace(/\s+/g, '_')}_${cert.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <div className="card-base p-5">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-7 h-7 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{user?.name}</h2>
                    <PointsBadge badge={user?.badge || "bronze"} size="sm" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)} aria-label={isEditing ? "Cancel editing" : "Edit profile"}>
                  {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-accent/50 rounded-lg p-3.5 text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-bold text-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    {user?.points || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="bg-accent/50 rounded-lg p-3.5 text-center">
                  <div className="text-lg font-bold text-foreground">{donations.length}</div>
                  <p className="text-xs text-muted-foreground">Donations</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input id="profile-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} className="input-base pl-9 disabled:bg-muted/50 disabled:cursor-not-allowed text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input id="profile-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className="input-base pl-9 disabled:bg-muted/50 disabled:cursor-not-allowed text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="profile-phone" className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input id="profile-phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditing} className="input-base pl-9 disabled:bg-muted/50 disabled:cursor-not-allowed text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="profile-location" className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input id="profile-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} disabled={!isEditing} className="input-base pl-9 disabled:bg-muted/50 disabled:cursor-not-allowed text-sm" />
                  </div>
                </div>
                {isEditing && (
                  <Button onClick={handleSave} className="w-full"><Save className="w-4 h-4 mr-1.5" />Save Changes</Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="card-base p-5">
              <h3 className="text-base font-semibold text-foreground mb-3">Donation History</h3>
              {historyLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[72px] bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3.5 bg-secondary/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{donation.organizationName}</p>
                        <p className="text-xs text-muted-foreground">{donation.type} &bull; {donation.quantity}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(donation.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        {donation.rewardPoints && <span className="text-xs font-medium text-primary">+{donation.rewardPoints} pts</span>}
                        <StatusBadge status={donation.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">No donations yet. Start making a difference today!</p>
                  <Link to="/dashboard"><Button size="sm" variant="outline"><Heart className="w-3.5 h-3.5 mr-1.5" />Browse Organizations</Button></Link>
                </div>
              )}
            </div>

            <div className="card-base p-5">
              <h3 className="text-base font-semibold text-foreground mb-3">Certificates</h3>
              {historyLoading ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-[72px] bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : certificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3.5 bg-secondary/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{cert.organizationName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{cert.donationType} Donation</p>
                        {cert.points && <p className="text-xs font-medium text-primary mt-0.5">+{cert.points} points awarded</p>}
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(cert.date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadCertificate(cert)} aria-label={`Download certificate for ${cert.organizationName}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">Complete donations to earn certificates!</p>
                  <Link to="/donate"><Button size="sm" variant="outline"><Gift className="w-3.5 h-3.5 mr-1.5" />Make a Donation</Button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Profile;
