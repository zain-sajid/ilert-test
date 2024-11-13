import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleMinus,
  TriangleAlert,
  Wrench
} from 'lucide-react';

export default function StatusIcon({ status }: { status: string }) {
  if (status === 'OPERATIONAL') {
    return <CircleCheck className="h-6 w-6 fill-green-600 text-white" />;
  } else if (status === 'UNDER_MAINTENANCE') {
    return (
      <div className="flex items-center justify-center rounded-full bg-neutral-500 p-1">
        <Wrench className="h-3 w-3 fill-white text-transparent" />
      </div>
    );
  } else if (status === 'DEGRADED') {
    return <CircleMinus className="h-6 w-6 fill-yellow-500 text-white" />;
  } else if (status === 'PARTIAL_OUTAGE') {
    return <TriangleAlert className="h-6 w-6 fill-orange-500 text-white" />;
  } else if (status === 'MAJOR_OUTAGE') {
    return <CircleAlert className="h-6 w-6 fill-red-500 text-white" />;
  } else {
    return <CircleHelp className="h-6 w-6 fill-orange-400 text-white" />;
  }
}
