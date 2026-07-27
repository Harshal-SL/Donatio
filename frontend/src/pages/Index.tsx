import { Link } from "react-router-dom";
import { MapPin, Award, Users, ArrowRight, Gift, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent rounded-full mb-5 animate-fade-in-up animate-delay-100">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Make a difference in your community
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight animate-fade-in-up animate-delay-200">
              Connect, Donate,{" "}
              <span className="text-gradient">Transform Lives</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
              Donatio connects generous donors with impactful organizations in your area.
              Every donation earns rewards and makes a real difference.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animate-delay-400">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Donating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/org/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Building2 className="w-4 h-4 mr-2" />
                  Register Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">How Donatio Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple, rewarding way to support causes you care about
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: MapPin,
                title: "Discover Nearby",
                description: "Find verified organizations in your area that need your help",
              },
              {
                icon: Gift,
                title: "Donate Items",
                description: "Contribute food, clothes, books, or make monetary donations",
              },
              {
                icon: Award,
                title: "Earn Rewards",
                description: "Get points and badges for every donation you make",
              },
              {
                icon: Users,
                title: "Track Impact",
                description: "See your contribution history and certificates",
              },
            ].map((feature) => (
              <div key={feature.title} className="card-hover p-5 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3.5">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-base gradient-primary p-8 lg:p-10 text-center border-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-3">
              Ready to make an impact?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join thousands of donors who are transforming their communities one donation at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/org/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50">
                  Register Your NGO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Donatio. All rights reserved. Students of BMSITM.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
