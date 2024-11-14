'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { fetcherWithAuthHeader } from '@/lib/fetcher';
import moment from 'moment';
import Image from 'next/image';
import useSWR from 'swr';

export default function RecentAlertActivity() {
  const { data, isLoading } = useSWR(
    '/api/alerts/newest-log-entries?include=alert&include=vars',
    fetcherWithAuthHeader
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hide-scrollbar relative overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
          <TableRow>
            <TableHead>Alert source</TableHead>
            <TableHead>Alert</TableHead>
            <TableHead className="w-[150px]">Time</TableHead>
            <TableHead className="w-[500px]">Activity</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((activity: any) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">
                <div className="flex flex-wrap gap-2">
                  <Image
                    src={activity.alert.alertSource.iconUrl}
                    alt={activity.alert.alertSource.name}
                    width={20}
                    height={20}
                  />
                  {activity.alert.alertSource.name}
                </div>
              </TableCell>
              <TableCell>{activity.alert.summary}</TableCell>
              <TableCell>{moment(activity.timestamp).fromNow()}</TableCell>
              <TableCell>{activity.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
