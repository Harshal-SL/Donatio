import { useState, useEffect } from "react";
import { Trophy, MapPin, Medal, User } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PageLayout } from "@/components/shared/PageLayout";
import { PointsBadge } from "@/components/shared/PointsBadge";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { donationService } from "@/services/donationService";
import { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";

const locations = [
  { value: "all", label: "All Locations" },
  { value: "Pune", label: "Pune, India" },
  { value: "Mumbai", label: "Mumbai, India" },
  { value: "Bengaluru", label: "Bengaluru, India" },
  { value: "Delhi", label: "Delhi, India" },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("all");

  const formatLocation = (location: string | undefined): string => {
    if (!location) return 'N/A';
    if (location.includes(', India')) return location;
    const capitalized = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
    return `${capitalized}, India`;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await donationService.getLeaderboard(selectedLocation);
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedLocation]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-primary/5 border-primary/20 border";
    if (rank === 2) return "bg-secondary border-border border";
    if (rank === 3) return "bg-accent border-accent border";
    return "bg-card border border-border";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-primary" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-accent-foreground" />;
    return <span className="text-foreground font-semibold text-sm">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageLayout>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-0.5">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">Top donors making an impact in their communities</p>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <label htmlFor="leaderboard-location" className="sr-only">Location</label>
            <select
              id="leaderboard-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="input-base pl-10 pr-8 appearance-none bg-card cursor-pointer min-w-[180px]"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {!isLoading && hasError ? (
          <div className="text-center py-8 mb-6">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Failed to load leaderboard</h3>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </div>
        ) : !isLoading && leaderboard.length >= 3 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {leaderboard.slice(0, 3).map((entry, index) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "card-base p-5 text-center",
                    isCurrentUser && "ring-1 ring-primary",
                    index === 0 && "sm:order-2",
                    index === 1 && "sm:order-1",
                    index === 2 && "sm:order-3"
                  )}
                >
                  <div className="relative mx-auto mb-3 w-16 h-16">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      index === 0 && "bg-primary/5",
                      index === 1 && "bg-muted",
                      index === 2 && "bg-accent"
                    )}>
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-sm",
                      index === 0 && "bg-primary",
                      index === 1 && "bg-muted-foreground",
                      index === 2 && "bg-accent-foreground"
                    )}>
                      {index === 0 && <Trophy className="w-3.5 h-3.5 text-primary-foreground" />}
                      {index === 1 && <Medal className="w-3.5 h-3.5 text-primary-foreground" />}
                      {index === 2 && <Medal className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-0.5">
                    {entry.name}
                    {isCurrentUser && <span className="ml-1.5 text-xs text-primary">(You)</span>}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2.5">{formatLocation(entry.location)}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold text-primary">{entry.points.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">pts</span>
                  </div>
                  <div className="mt-2">
                    <PointsBadge badge={entry.badge} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Donor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Points</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Badge</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                ) : (
                  leaderboard.map((entry) => {
                    const isCurrentUser = entry.userId === user?.id;
                    return (
                      <tr
                        key={entry.userId}
                        className={cn(
                          "border-b border-border/50 transition-colors hover:bg-muted/30",
                          isCurrentUser && "bg-primary/5"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                              entry.rank === 1 && "bg-primary/5 border border-primary/20",
                              entry.rank === 2 && "bg-secondary border border-border",
                              entry.rank === 3 && "bg-accent border border-accent",
                              entry.rank > 3 && "bg-muted/50 border border-border"
                            )}>
                              {entry.rank === 1 ? <Trophy className="w-4 h-4 text-primary" /> :
                               entry.rank === 2 ? <Medal className="w-4 h-4 text-muted-foreground" /> :
                               entry.rank === 3 ? <Medal className="w-4 h-4 text-accent-foreground" /> :
                               <span className="text-foreground font-bold">{entry.rank}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-foreground">{entry.name}</span>
                          {isCurrentUser && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">You</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{formatLocation(entry.location)}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">{entry.points.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <PointsBadge badge={entry.badge} showLabel={false} size="sm" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Leaderboard;
