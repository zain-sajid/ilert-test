'use client';

import { fetcherWithAuthHeader } from '@/lib/fetcher';

import useSWR from 'swr';
import MetricGraph from '@/components/metric-graph';
import SkeletonWidget from '@/components/skeletons/skeleton-widget';

export default function Metrics() {
  const { data: metrics, isLoading } = useSWR<Metrics>(
    '/api/metrics',
    fetcherWithAuthHeader
  );

  if (isLoading) {
    return <SkeletonWidget />;
  }

  if (!metrics) {
    return <div>No metrics found</div>;
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
