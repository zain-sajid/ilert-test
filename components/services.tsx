'use client';

import { fetcherWithAuthHeader } from '@/lib/fetcher';
import moment from 'moment';
import Link from 'next/link';
import useSWR from 'swr';
import StatusIcon from '@/components/status-icon';

export default function Services() {
  const { data: services, isLoading } = useSWR(
    '/api/services?include=uptime',
    fetcherWithAuthHeader
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function formatTimeSince(timestamp: string) {
    const diffDays = moment().diff(moment(timestamp), 'days');

    if (diffDays === 0) {
      return 'since today';
    } else if (diffDays === 1) {
      return 'since yesterday';
    } else {
      return `since ${diffDays} days`;
    }
  }

  return (
    <div className="h-full w-full rounded-sm border bg-white p-6">
      <h2 className="mb-4 text-lg font-medium">Services</h2>

      <div className="flex flex-col">
        {services.map((service: any) => (
          <div key={service.id} className="flex justify-between border-y py-2">
            <div className="flex items-center gap-2">
              <StatusIcon status={service.status} />
              <Link href="#" className="text-sm text-blue-700 hover:underline">
                {service.name}
              </Link>
            </div>

            <div className="text-sm text-neutral-700">
              {`${service.uptime.uptimePercentage.p90.toFixed(0)}% uptime in the past ${formatTimeSince(service.uptime.rangeStart)}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
