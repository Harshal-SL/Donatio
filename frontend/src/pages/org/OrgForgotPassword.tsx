import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Building2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { orgService } from "@/services/orgService";
import { toast } from "sonner";

const OrgForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your organization email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await orgService.forgotPassword(email);
      toast.success(result.message);
      setEmailSent(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full text-center">
          <Logo />
          <div className="mt-8 card-base p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-sm text-muted-foreground mb-5">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/org/login")} className="w-full">Back to Login</Button>
              <Button variant="outline" onClick={() => setEmailSent(false)} className="w-full">
                Didn't receive email? Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
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
          <h1 className="text-xl font-bold text-foreground mb-1">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="org-forgot-email" className="block text-sm font-medium text-foreground mb-1.5">Organization Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="org-forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base pl-10"
                  placeholder="org@example.com"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <Link to="/org/login">
            <Button variant="ghost" className="w-full mt-3">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Login
            </Button>
          </Link>

          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-2.5">
              Are you a donor?
            </p>
            <Link to="/forgot-password">
              <Button variant="outline" className="w-full">Donor Password Reset</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-96 gradient-primary items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Reset Your Password</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            We'll help you get back to managing your organization and accepting donations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrgForgotPassword;
