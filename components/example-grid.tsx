'use client';

import React, { useEffect, useState } from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import OpenAlerts from '@/components/open-alerts';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useSWR from 'swr';
import { fetcherWithAuthHeader } from '@/lib/fetcher';
import RecentAlertActivity from './recent-alert-activity';
import Metrics from './metrics';
import Services from './services';
import OpenIncidents from './open-incidents';
import { mutateData } from '@/lib/request';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Save } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { findLayoutGap } from '@/lib/utils';

const ResponsiveGridLayout = WidthProvider(GridLayout);

const components = [
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
  }
];

const ExampleGrid = () => {
  const [isEditting, setIsEditting] = useState(false);
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
        selectedDashboard.widgets.map((widget: any, index: number) => ({
          i: widget.meta.id,
          x: widget.meta.position.x,
          y: widget.meta.position.y,
          w: widget.meta.position.width,
          h: widget.meta.position.height
        }))
      );
    }
  }, [selectedDashboard]);

  const updateDashboardWithLayout = (dashboard: any, newLayout: any): any => {
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
      name: 'New widget',
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

  async function onLayoutChange() {
    const data = updateDashboardWithLayout(selectedDashboard, layoutConfig);
    await mutateData(
      `api/user-dashboards/${selectedDashboard.id}`,
      data,
      'PUT'
    );
    mutate(data);
  }

  async function onLayoutSave() {
    const data = updateDashboardWithLayout(selectedDashboard, layoutConfig);
    await mutateData(
      `api/user-dashboards/${selectedDashboard.id}`,
      data,
      'PUT'
    );
    mutate(data);
  }



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
        <h1 className="text-xl font-medium">Zain's Dashboard1 / All teams</h1>
        <div className="mb-2 flex gap-2">
          {isEditting ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await onLayoutChange();
                setIsEditting(false);
              }}
            >
              <Save />
              Save
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsEditting(true);
              }}
            >
              <Pencil />
              Edit
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <Plus />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {components.map((component) => (
                <DropdownMenuItem
                  key={component.type}
                  onClick={() => addComponentToLayout(component.type)}
                >
                  {component.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ResponsiveGridLayout
        className="select-none"
        layout={layoutConfig}
        cols={24}
        rowHeight={50}
        // width={1200}
        isResizable={false}
        isDraggable={isEditting}
        onLayoutChange={(layout) => setLayoutConfig(layout)}
      >
        {selectedDashboard.widgets.map((widget: any, index: number) => (
          <div key={widget.meta.id} className="w-full">
            <DashboardComponent type={widget.type} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

function DashboardComponent({ type }: { type: string }) {
  switch (type) {
    case 'OPEN_ALERTS':
      return <OpenAlerts />;
    case 'ALERT_ACTIVITY':
      return <RecentAlertActivity />;
    case 'METRICS':
      return <Metrics />;
    case 'SERVICES':
      return <Services />;
    case 'OPEN_INCIDENTS':
      return <OpenIncidents />;
    default:
      return <div>Unknown widget type</div>;
  }
}

export default ExampleGrid;
