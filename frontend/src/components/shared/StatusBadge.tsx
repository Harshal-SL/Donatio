import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "accepted" | "rejected" | "completed";
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning",
  },
  accepted: {
    label: "Accepted",
    className: "bg-primary/10 text-primary",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn("badge-status", config.className, className)}
    >
      {config.label}
    </span>
  );
};
