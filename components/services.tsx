'use client';

import moment from 'moment';
import Link from 'next/link';
import StatusIcon from '@/components/status-icon';
import SkeletonWidget from './skeletons/skeleton-widget';
import { useDashboard } from '@/context/dashboard';
import { useSWRWithContext } from '@/hooks/useSWRWithContext';

export default function Services() {
  const { teamContext } = useDashboard();

  const { data: services, isLoading } = useSWRWithContext<Services>({
    url: '/api/services?include=uptime',
    teamContext
  });

  if (isLoading) {
    return <SkeletonWidget />;
  }

  if (!services || services.length === 0) {
    return <div className="text-neutral-500">No services found</div>;
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
    <div className="flex flex-col">
      {services.map((service) => (
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
  );
}
