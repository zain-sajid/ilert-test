import Link from 'next/link';

export default function OpenAlerts() {
  return (
    <div className="w-full rounded-sm border bg-white p-6">
      <h2 className="mb-4 text-lg font-medium">Open alerts</h2>

      <div className="flex">
        <div className="mx-auto flex flex-col items-center gap-4">
          <p className="font-medium">Pending</p>
          <Link
            href="#"
            className="text-3xl font-bold text-blue-700 hover:underline"
          >
            0
          </Link>
        </div>

        <div className="h-auto w-0.5 bg-neutral-200"></div>

        <div className="mx-auto flex flex-col items-center gap-4">
          <p className="font-medium">Pending</p>
          <Link
            href="#"
            className="text-3xl font-bold text-blue-700 hover:underline"
          >
            0
          </Link>
        </div>
      </div>
    </div>
  );
}
