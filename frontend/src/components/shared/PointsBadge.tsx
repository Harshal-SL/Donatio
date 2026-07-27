import { cn } from "@/lib/utils";
import { Award, Star, Trophy, Crown } from "lucide-react";

interface PointsBadgeProps {
  badge: "bronze" | "silver" | "gold" | "platinum";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeConfig = {
  bronze: {
    label: "Bronze",
    icon: Award,
    className: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
  silver: {
    label: "Silver",
    icon: Star,
    className: "bg-muted text-muted-foreground",
  },
  gold: {
    label: "Gold",
    icon: Trophy,
    className: "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400",
  },
  platinum: {
    label: "Platinum",
    icon: Crown,
    className: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
  },
};

const sizeConfig = {
  sm: { container: "px-2 py-0.5 text-xs", icon: "w-3 h-3" },
  md: { container: "px-2.5 py-1 text-sm", icon: "w-3.5 h-3.5" },
  lg: { container: "px-3 py-1.5 text-base", icon: "w-4 h-4" },
};

export const PointsBadge: React.FC<PointsBadgeProps> = ({
  badge,
  showLabel = true,
  size = "md",
  className,
}) => {
  const config = badgeConfig[badge];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        config.className,
        sizeStyles.container,
        className
      )}
    >
      <Icon className={cn(sizeStyles.icon)} />
      {showLabel && config.label}
    </span>
  );
};
