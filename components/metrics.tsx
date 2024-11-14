'use client';

import { fetcherWithAuthHeader } from '@/lib/fetcher';

import useSWR from 'swr';
import MetricGraph from '@/components/metric-graph';

export default function Metrics() {
  const { data: metrics, isLoading } = useSWR(
    '/api/metrics',
    fetcherWithAuthHeader
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {metrics.map((metric: any) => {
        return (
          <div key={metric.id} className="mb-4">
            <MetricGraph metric={metric} />
          </div>
        );
      })}
    </div>
  );
}
