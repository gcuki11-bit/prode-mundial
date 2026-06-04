import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      <div>
        <Skeleton className="h-4 w-24 mb-2 bg-white/5" />
        <Skeleton className="h-10 w-48 bg-white/5" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_,i) => (
          <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <Skeleton className="h-3 w-20 mb-4 bg-white/5" />
            <Skeleton className="h-10 w-16 bg-white/5" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <Skeleton className="h-6 w-40 mb-6 bg-white/5" />
          <div className="space-y-2">
            {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-14 w-full bg-white/5" />)}
          </div>
        </div>
        <div className="glass-card">
          <Skeleton className="h-6 w-32 mb-6 bg-white/5" />
          <div className="space-y-3">
            {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-10 w-full bg-white/5" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
