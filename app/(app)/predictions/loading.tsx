import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <Skeleton className="h-10 w-40 bg-white/5" />
      <div className="grid gap-4">
        {[...Array(5)].map((_,i) => (
          <div key={i} className="glass-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
                <Skeleton className="h-5 w-24 bg-white/5" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-xl bg-white/5" />
                <Skeleton className="h-4 w-8 bg-white/5" />
                <Skeleton className="h-16 w-16 rounded-xl bg-white/5" />
              </div>
              <div className="flex items-center gap-4 flex-1 justify-end">
                <Skeleton className="h-5 w-24 bg-white/5" />
                <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
