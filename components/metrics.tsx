'use client';

import MetricGraph from '@/components/metric-graph';
import SkeletonWidget from '@/components/skeletons/skeleton-widget';
import { useDashboard } from '@/context/dashboard';
import { useSWRWithContext } from '@/hooks/useSWRWithContext';

export default function Metrics() {
  const { teamContext } = useDashboard();

  const { data: metrics, isLoading } = useSWRWithContext<Metrics>({
    url: '/api/metrics',
    teamContext
  });

  if (isLoading) {
    return <SkeletonWidget />;
  }

  if (!metrics || metrics.length === 0) {
    return <div className="text-neutral-500">No metrics found</div>;
  }

  return (
    <div className="flex flex-col">
      {metrics.map((metric) => {
        return (
          <div key={metric.id} className="mb-4">
            <MetricGraph metric={metric} />
          </div>
        );
      })}
    </div>
  );
}
