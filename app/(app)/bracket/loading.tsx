import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <Skeleton className="h-10 w-48 bg-white/5" />
      <div className="glass-card">
        <div className="space-y-3">
          {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-12 w-full bg-white/5" />)}
        </div>
      </div>
    </div>
  );
}
