'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import moment from 'moment';
import Image from 'next/image';
import SkeletonWidget from './skeletons/skeleton-widget';
import { useDashboard } from '@/context/dashboard';
import { useSWRWithContext } from '@/hooks/useSWRWithContext';

export default function RecentAlertActivity() {
  const { teamContext } = useDashboard();

  const { data: alertActivity, isLoading } =
    useSWRWithContext<AlertActivityResponse>({
      url: '/api/alerts/newest-log-entries?include=alert&include=vars',
      teamContext
    });

  if (isLoading) {
    return <SkeletonWidget />;
  }

  if (!alertActivity || alertActivity.length === 0) {
    return <div className="text-neutral-500">No alert activity found</div>;
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
          {alertActivity.map((activity) => (
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
