'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { fetcherWithAuthHeader } from '@/lib/fetcher';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/context/dashboard';

export default function OpenAlerts() {
  const { teamContext } = useDashboard();

  const { data: pendingAlerts, isLoading: pendingAlertsLoading } = useSWR(
    ['/api/alerts?states=PENDING', teamContext],
    ([url, teamContext]) => fetcherWithAuthHeader(url, teamContext)
  );

  const { data: acceptedAlerts, isLoading: acceptedAlertsLoading } = useSWR(
    ['/api/alerts?states=ACCEPTED', teamContext],
    ([url, teamContext]) => fetcherWithAuthHeader(url, teamContext)
  );

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
            {pendingAlerts?.length}
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
            {acceptedAlerts?.length}
          </Link>
        )}
      </div>
    </div>
  );
}
