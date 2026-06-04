import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <Skeleton className="h-10 w-56 bg-white/5" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_,i) => (
          <div key={i} className="glass-card text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3 bg-white/5" />
            <Skeleton className="h-4 w-20 mx-auto mb-2 bg-white/5" />
            <Skeleton className="h-8 w-12 mx-auto bg-white/5" />
          </div>
        ))}
      </div>
      <div className="glass-card p-0 overflow-hidden">
        {[...Array(8)].map((_,i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
            <Skeleton className="h-4 w-6 bg-white/5" />
            <Skeleton className="h-9 w-9 rounded-full bg-white/5" />
            <Skeleton className="h-4 w-32 bg-white/5 flex-1" />
            <Skeleton className="h-4 w-12 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
