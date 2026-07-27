import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Building2, Phone, MapPin, FileText, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { orgService } from "@/services/orgService";
import { toast } from "sonner";

const categories = [
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "environment", label: "Environment" },
  { value: "animal-welfare", label: "Animal Welfare" },
  { value: "poverty-relief", label: "Poverty Relief" },
  { value: "disaster-relief", label: "Disaster Relief" },
  { value: "elderly-care", label: "Elderly Care" },
  { value: "other", label: "Other" },
];

const OrgSignup = () => {
  const navigate = useNavigate();
  const { loginOrg } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
    location: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.registrationNumber || !formData.location || !formData.category) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { organization, token, emailConfirmationRequired } = await orgService.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        registrationNumber: formData.registrationNumber,
        location: formData.location,
        category: formData.category,
      });

      if (emailConfirmationRequired) {
        toast.success("Registration successful! Please check your email to verify your account.");
        navigate("/org/verify-email");
      } else {
        loginOrg(organization, token);
        toast.success("Organization registered successfully!");
        navigate("/org/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Organization Portal</span>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">Register Your Organization</h1>
          <p className="text-sm text-muted-foreground">
            Join Donatio to receive donations and grow your impact
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="org-signup-name" className="block text-sm font-medium text-foreground mb-1.5">Organization Name</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="org-signup-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-base pl-10"
                  placeholder="Hope Foundation"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="org-signup-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="org-signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-base pl-10"
                    placeholder="org@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="org-signup-phone" className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="org-signup-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-base pl-10"
                    placeholder="+91 20 1234 5678"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="org-signup-reg-number" className="block text-sm font-medium text-foreground mb-1.5">Registration Number</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="org-signup-reg-number"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="input-base pl-10"
                  placeholder="NGO/MH/2024/12345"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="org-signup-location" className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="org-signup-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-base pl-10"
                    placeholder="Pune, India"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="org-signup-category" className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    id="org-signup-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-base pl-10 appearance-none"
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="org-signup-password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="org-signup-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-base pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-9 h-9 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="org-signup-confirm-password" className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="org-signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-base pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Organization"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/org/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-96 gradient-primary items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Grow Your Impact</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Connect with generous donors in your area, manage donations efficiently, and make a bigger difference together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrgSignup;
