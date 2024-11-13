'use client';

import { fetcherWithAuthHeader } from '@/lib/fetcher';

import moment from 'moment';
import Link from 'next/link';
import useSWR from 'swr';
import StatusIcon from '@/components/status-icon';

export default function OpenIncidents() {
  const { data: incidents, isLoading } = useSWR(
    '/api/incidents',
    fetcherWithAuthHeader
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full rounded-sm border bg-white p-6">
      <h2 className="mb-4 text-lg font-medium">Open incidents</h2>

      <div className="flex flex-col">
        {incidents.map((incident: any) => (
          <div
            key={incident.id}
            className="flex flex-col gap-2 border-t py-2 last:border-b"
          >
            <div className="flex justify-between">
              <Link href="#" className="text-blue-700 hover:underline">
                {incident.summary}
              </Link>
              <div className="flex items-center justify-center rounded-md bg-sky-600 px-2 text-xs font-semibold text-white">
                {incident.status}
              </div>
            </div>

            <p className="text-sm text-neutral-600">
              <span className="font-semibold">
                {moment(incident.createdAt).fromNow()}
              </span>{' '}
              - {incident.message}
            </p>

            <div className="flex gap-3">
              {incident.affectedServices.map((affectedService: any) => (
                <div
                  key={affectedService.service.id}
                  className="flex items-center gap-1"
                >
                  <StatusIcon status={affectedService.service.status} />
                  <Link
                    href="#"
                    className="text-sm text-neutral-600 hover:underline"
                  >
                    {affectedService.service.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
