import { Skeleton } from '@/components/ui/skeleton';
import SkeletonWidget from '@/components/skeletons/skeleton-widget';

export default function SkeletonDashboard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-4 h-[40px] w-[240px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[300px] rounded-sm border bg-white p-6">
            <SkeletonWidget />
          </div>
        ))}
      </div>
    </div>
  );
}
