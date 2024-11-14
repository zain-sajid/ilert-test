'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { fetcherWithAuthHeader } from '@/lib/fetcher';
import EditableInput from '@/components/ui/editable-input';
import { DashboardContext } from '@/components/dashboard';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';

export default function OpenAlerts({
  id,
  initialName
}: {
  id: string;
  initialName: string;
}) {
  const { selectedDashboard, mutate, isEditing } = useContext(DashboardContext);

  const [name, setName] = useState(initialName);

  const { data: pendingAlerts } = useSWR(
    '/api/alerts?states=PENDING',
    fetcherWithAuthHeader
  );

  const { data: acceptedAlerts } = useSWR(
    '/api/alerts?states=ACCEPTED',
    fetcherWithAuthHeader
  );

  function changeWidgetName(value: string) {
    const updatedDashboard = {
      ...selectedDashboard,
      widgets: selectedDashboard.widgets.map((widget: any) =>
        widget.meta.id === id
          ? {
              ...widget,
              name: value
            }
          : widget
      )
    };

    mutate(updatedDashboard, {
      revalidate: false
    });
  }

  function deleteWidget() {
    const deleteWidget = selectedDashboard.widgets.find(
      (widget: any) => widget.meta.id === id
    );

    const addComponentWidget = {
      name: 'Add component',
      type: 'ADD_COMPONENT',
      meta: {
        id: crypto.randomUUID(),
        position: {
          x: deleteWidget.meta.position.x,
          y: deleteWidget.meta.position.y,
          width: 12,
          height: 6
        }
      }
    };

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: [
        ...selectedDashboard.widgets.filter(
          (widget: any) =>
            widget.meta.id !== id && widget.type !== 'ADD_COMPONENT'
        ),
        addComponentWidget
      ]
    };

    mutate(updatedDashboard, {
      revalidate: false
    });
  }

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-sm border bg-white p-6">
      {isEditing ? (
        <div className="non-draggable flex justify-between">
          <EditableInput
            value={name}
            onValueChange={(value) => {
              changeWidgetName(value);
              setName(value);
            }}
          />
          <Button size="icon" variant="secondary" onClick={deleteWidget}>
            <Trash className="h-6 w-6" />
          </Button>
        </div>
      ) : (
        <h2 className="px-3 py-1 text-lg font-medium">{name}</h2>
      )}

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
