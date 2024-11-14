'use client';

import React, { createContext, useEffect, useState } from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';

import useSWR from 'swr';
import { mutateData } from '@/lib/request';
import { fetcherWithAuthHeader } from '@/lib/fetcher';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import OpenAlerts from '@/components/open-alerts';

import Metrics from '@/components/metrics';
import Services from '@/components/services';
import { Button } from '@/components/ui/button';
import AddComponent from '@/components/add-component';
import OpenIncidents from '@/components/open-incidents';
import RecentAlertActivity from '@/components/recent-alert-activity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { cn, findLayoutGap } from '@/lib/utils';
import { Loader2, Pencil, Plus, Save } from 'lucide-react';

export const components = [
  {
    type: 'OPEN_ALERTS',
    name: 'Open alerts'
  },
  {
    type: 'ALERT_ACTIVITY',
    name: 'Recent alert activity'
  },
  {
    type: 'METRICS',
    name: 'Metrics'
  },
  {
    type: 'SERVICES',
    name: 'Service status'
  },
  {
    type: 'OPEN_INCIDENTS',
    name: 'Open incidents'
  },
  {
    type: 'ADD_COMPONENT',
    name: 'Add component'
  }
];

const ResponsiveGridLayout = WidthProvider(GridLayout);

type DashboardContextType = {
  selectedDashboard: any;
  layoutConfig: any;
  mutate: any;
  isEditing: boolean;
};

export const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);

export default function Dashboard() {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState<any>(null);

  const { data: dashboardPreference, isLoading: dashboardPreferenceLoading } =
    useSWR('/api/v1/user-view-preferences/DASHBOARD', fetcherWithAuthHeader);

  const {
    data: selectedDashboard,
    isLoading: dashboardLoading,
    mutate
  } = useSWR(
    dashboardPreference?.id
      ? `/api/user-dashboards/${dashboardPreference.id}`
      : null,
    fetcherWithAuthHeader,
    {
      revalidateOnFocus: false
    }
  );

  useEffect(() => {
    if (selectedDashboard) {
      setLayoutConfig(
        selectedDashboard.widgets.map((widget: any) => ({
          i: widget.meta.id,
          x: widget.meta.position.x,
          y: widget.meta.position.y,
          w: widget.meta.position.width,
          h: widget.meta.position.height
        }))
      );
    }
  }, [selectedDashboard]);

  const updateDashboardLayout = (dashboard: any, newLayout: any): any => {
    const updatedDashboard = { ...dashboard };

    updatedDashboard.widgets = dashboard.widgets.map((widget: any) => {
      const layoutItem = newLayout.find(
        (item: any) => item.i === widget.meta.id
      );

      if (layoutItem) {
        return {
          ...widget,
          meta: {
            ...widget.meta,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              width: layoutItem.w,
              height: layoutItem.h
            }
          }
        };
      }
      return widget;
    });

    return updatedDashboard;
  };

  const addComponentToLayout = (type: string) => {
    const newPosition = findLayoutGap(layoutConfig, 12);
    const newWidget = {
      name:
        components.find((component) => component.type === type)?.name ||
        'Widget',
      type,
      meta: {
        id: crypto.randomUUID(),
        position: {
          x: newPosition.x,
          y: newPosition.y,
          width: 12,
          height: 6
        }
      }
    };

    mutate(
      {
        ...selectedDashboard,
        widgets: [...selectedDashboard.widgets, newWidget]
      },
      {
        revalidate: false
      }
    );
  };

  async function saveLayout() {
    setIsSaving(true);

    const filteredDashboard = {
      ...selectedDashboard,
      widgets: selectedDashboard.widgets.filter(
        (widget: any) => widget.type !== 'ADD_COMPONENT'
      )
    };

    const data = updateDashboardLayout(filteredDashboard, layoutConfig);

    await mutateData(
      `api/user-dashboards/${selectedDashboard.id}`,
      data,
      'PUT'
    );

    mutate(data);
    setIsSaving(false);
  }

  const handleEditMode = () => {
    addComponentToLayout('ADD_COMPONENT');
    setIsEditing(true);
  };

  if (dashboardPreferenceLoading) {
    return <div>Loading preferences...</div>;
  }

  if (!dashboardPreference?.id) {
    return <div>No dashboard selected</div>;
  }

  if (dashboardLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Zain's Dashboard / All teams</h1>
        <div className="mb-2 flex gap-2">
          {isEditing ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await saveLayout();
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              Save
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleEditMode}>
              <Pencil />
              Edit
            </Button>
          )}

          {isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Plus />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {components
                  .filter((component) => component.type !== 'ADD_COMPONENT')
                  .map((component) => (
                    <DropdownMenuItem
                      key={component.type}
                      onClick={() => addComponentToLayout(component.type)}
                    >
                      {component.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <DashboardContext.Provider
        value={{ selectedDashboard, layoutConfig, mutate, isEditing }}
      >
        <ResponsiveGridLayout
          className="select-none"
          layout={layoutConfig}
          cols={24}
          rowHeight={50}
          isResizable={false}
          isDraggable={isEditing}
          onLayoutChange={(layout) => setLayoutConfig(layout)}
          draggableCancel=".non-draggable"
        >
          {selectedDashboard.widgets.map((widget: any) => (
            <div
              key={widget.meta.id}
              className={cn('w-full', isEditing && 'cursor-pointer')}
            >
              <DashboardComponent
                id={widget.meta.id}
                position={widget.meta.position}
                name={widget.name}
                type={widget.type}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </DashboardContext.Provider>
    </div>
  );
}

function DashboardComponent({
  id,
  name,
  type,
  position
}: {
  id: string;
  name: string;
  type: string;
  position: any;
}) {
  switch (type) {
    case 'OPEN_ALERTS':
      return <OpenAlerts id={id} initialName={name} />;
    case 'ALERT_ACTIVITY':
      return <RecentAlertActivity />;
    case 'METRICS':
      return <Metrics />;
    case 'SERVICES':
      return <Services />;
    case 'OPEN_INCIDENTS':
      return <OpenIncidents />;
    case 'ADD_COMPONENT':
      return <AddComponent id={id} position={position} />;
    default:
      return <div>Unknown widget type</div>;
  }
}
