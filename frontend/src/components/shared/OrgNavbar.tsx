import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, Building2, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/org/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/org/profile", label: "Organization", icon: Building2 },
];

export const OrgNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isOrgAuthenticated, organization, logoutOrg } = useAuth();

  const handleLogout = () => {
    logoutOrg();
    navigate("/org/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Logo linkTo={isOrgAuthenticated ? "/org/dashboard" : "/"} />
            {isOrgAuthenticated && (
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Organization
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1">
            {isOrgAuthenticated &&
              navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isOrgAuthenticated ? (
              <>
                <span className="text-sm font-medium text-foreground">
                  {organization?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground text-sm"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/org/login">
                  <Button variant="ghost" size="sm">Org Login</Button>
                </Link>
                <Link to="/org/signup">
                  <Button size="sm">Register Org</Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-lg hover:bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {isOrgAuthenticated ? (
              <>
                <div className="px-3.5 py-2.5 mb-2 bg-secondary rounded-lg">
                  <p className="font-medium text-foreground text-sm">{organization?.name}</p>
                  <p className="text-xs text-muted-foreground">Organization Account</p>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/org/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Org Login</Button>
                </Link>
                <Link to="/org/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Register Org</Button>
                </Link>
              </div>
            )}
            <div className="flex justify-center pt-2 border-t border-border mt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
