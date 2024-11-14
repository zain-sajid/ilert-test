'use client';

import { fetcherWithAuthHeader } from '@/lib/fetcher';

import useSWR from 'swr';
import MetricGraph from '@/components/metric-graph';
import SkeletonWidget from '@/components/skeletons/skeleton-widget';
import { useDashboard } from '@/context/dashboard';

export default function Metrics() {
  const { teamContext } = useDashboard();

  const { data: metrics, isLoading } = useSWR<Metrics>(
    ['/api/metrics', teamContext],
    ([url, teamContext]) =>
      fetcherWithAuthHeader(url, teamContext as number | undefined)
  );

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
