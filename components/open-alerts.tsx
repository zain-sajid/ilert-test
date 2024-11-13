'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { fetcherWithAuthHeader } from '@/lib/fetcher';

export default function OpenAlerts() {
  const { data: pendingAlerts } = useSWR(
    '/api/alerts?states=PENDING',
    fetcherWithAuthHeader
  );

  const { data: acceptedAlerts } = useSWR(
    '/api/alerts?states=ACCEPTED',
    fetcherWithAuthHeader
  );

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-sm border bg-white p-6">
      <h2 className="mb-4 text-lg font-medium">Open alerts</h2>

      <div className="flex h-full items-center">
        <div className="mx-auto flex flex-col items-center gap-4">
          <p className="font-medium">Pending</p>
          <Link
            href="#"
            className="text-3xl font-bold text-blue-700 hover:underline"
          >
            {pendingAlerts?.length}
          </Link>
        </div>

        <div className="h-full w-0.5 bg-neutral-200"></div>

        <div className="mx-auto flex flex-col items-center gap-4">
          <p className="font-medium">Accepted</p>
          <Link
            href="#"
            className="text-3xl font-bold text-blue-700 hover:underline"
          >
            {acceptedAlerts?.length}
          </Link>
        </div>
      </div>
    </div>
  );
}
