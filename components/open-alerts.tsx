'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/context/dashboard';
import { useSWRWithContext } from '@/hooks/useSWRWithContext';

export default function OpenAlerts() {
  const { teamContext } = useDashboard();

  const { data: pendingAlerts, isLoading: pendingAlertsLoading } =
    useSWRWithContext<Alerts>({
      url: '/api/alerts?states=PENDING',
      teamContext
    });

  const { data: acceptedAlerts, isLoading: acceptedAlertsLoading } =
    useSWRWithContext<Alerts>({
      url: '/api/alerts?states=ACCEPTED',
      teamContext
    });

  return (
    <div className="flex h-full items-center">
      <div className="mx-auto flex flex-col items-center gap-4">
        <p className="font-medium">Pending</p>
        {pendingAlertsLoading ? (
          <Skeleton className="h-9 w-9" />
        ) : (
          <Link
            href="#"
            className="text-3xl font-bold text-blue-700 hover:underline"
          >
            {pendingAlerts?.length ?? 0}
          </Link>
        )}
      </div>

      <div className="h-full w-0.5 bg-neutral-200" />

      <div className="mx-auto flex flex-col items-center gap-4">
        <p className="font-medium">Accepted</p>
        {acceptedAlertsLoading ? (
          <Skeleton className="h-9 w-9" />
        ) : (
          <Link
            href="#"
            className="text-3xl font-bold text-blue-700 hover:underline"
          >
            {acceptedAlerts?.length ?? 0}
          </Link>
        )}
      </div>
    </div>
  );
}
