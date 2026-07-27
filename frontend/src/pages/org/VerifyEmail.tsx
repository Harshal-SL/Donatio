import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { toast } from "sonner";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const savedOrg = localStorage.getItem("organization");
    if (savedOrg) {
      try {
        const org = JSON.parse(savedOrg);
        setEmail(org.email);
      } catch (error) {
        console.error("Error parsing organization:", error);
      }
    }
  }, []);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      toast.success("Verification email resent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo />
        </div>

        <div className="card-base p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <h1 className="text-lg font-bold text-foreground mb-2">
            Verify Your Email Address
          </h1>

          <p className="text-sm text-muted-foreground mb-4">
            We've sent a verification email to:
          </p>

          <p className="text-sm font-medium text-foreground mb-5 break-all">
            {email || "your email address"}
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-5 text-left">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Click the verification link in the email to activate your account.</p>
                <p>If you don't see the email, check your spam folder.</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleResendVerification}
            variant="outline"
            className="w-full mb-4"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground">
            Already verified?{" "}
            <Link to="/org/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <a href="mailto:support@donatio.com" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
