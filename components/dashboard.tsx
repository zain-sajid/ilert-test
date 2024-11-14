'use client';

import React, { useState } from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';

import useSWR from 'swr';
import type { LayoutConfig, Dashboard } from '@/types';
import { mutateData } from '@/lib/request';
import { components } from '@/data/components';
import { fetcherWithAuthHeader } from '@/lib/fetcher';
import { DashboardContext } from '@/context/dashboard';

import { Button } from '@/components/ui/button';
import EditableInput from '@/components/ui/editable-input';
import DashboardComponent from '@/components/dashboard-component';
import SkeletonDashboard from '@/components/skeletons/skeleton-dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { cn, findLayoutGap } from '@/lib/utils';
import { Loader2, Pencil, Plus, Save, Trash } from 'lucide-react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(GridLayout);

export default function Dashboard() {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: dashboardPreference, isLoading: dashboardPreferenceLoading } =
    useSWR('/api/v1/user-view-preferences/DASHBOARD', fetcherWithAuthHeader);

  const {
    data: selectedDashboard,
    isLoading: dashboardLoading,
    mutate
  } = useSWR<Dashboard>(
    dashboardPreference?.id
      ? `/api/user-dashboards/${dashboardPreference.id}`
      : null,
    fetcherWithAuthHeader,
    {
      revalidateOnFocus: false
    }
  );

  const layoutConfig = selectedDashboard?.widgets.map((widget) => ({
    i: widget.meta.id,
    x: widget.meta.position.x,
    y: widget.meta.position.y,
    w: widget.meta.position.width,
    h: widget.meta.position.height
  }));

  const updateDashboardLayout = (
    dashboard: Dashboard,
    newLayout?: LayoutConfig
  ) => {
    if (!newLayout) return dashboard;

    const updatedDashboard = { ...dashboard };

    updatedDashboard.widgets = dashboard.widgets.map((widget) => {
      const layoutItem = newLayout.find((item) => item.i === widget.meta.id);

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

  const addWidgetToDashboard = (type: string) => {
    if (!selectedDashboard || !layoutConfig) return;

    const existingAddComponent = selectedDashboard.widgets.find(
      (w) => w.type === 'ADD_COMPONENT'
    );

    const newAddComponentPosition = findLayoutGap(layoutConfig, 12);

    const newAddComponentWidget = {
      name: 'Add component',
      type: 'ADD_COMPONENT',
      meta: {
        id: crypto.randomUUID(),
        position: {
          x: newAddComponentPosition.x || 0,
          y: newAddComponentPosition.y || 0,
          width: 12,
          height: 6
        }
      }
    };

    const widgets =
      type !== 'ADD_COMPONENT'
        ? [
            ...selectedDashboard.widgets.filter(
              (w) => w.meta.id !== existingAddComponent?.meta.id
            ),
            {
              name:
                components.find((component) => component.type === type)?.name ||
                'Widget',
              type,
              meta: {
                id: crypto.randomUUID(),
                position: {
                  x: existingAddComponent?.meta.position.x || 0,
                  y: existingAddComponent?.meta.position.y || 0,
                  width: 12,
                  height: 6
                }
              }
            },
            newAddComponentWidget
          ]
        : [...selectedDashboard.widgets, newAddComponentWidget];

    mutate(
      {
        ...selectedDashboard,
        widgets: widgets
      },
      {
        revalidate: false
      }
    );
  };

  const saveLayout = async () => {
    if (!selectedDashboard) return;

    setIsSaving(true);

    const filteredDashboard = {
      ...selectedDashboard,
      widgets: selectedDashboard.widgets.filter(
        (widget) => widget.type !== 'ADD_COMPONENT'
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
  };

  const handleEditMode = () => {
    addWidgetToDashboard('ADD_COMPONENT');
    setIsEditing(true);
  };

  function changeWidgetName(id: string, value: string) {
    if (!selectedDashboard) return;

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: selectedDashboard.widgets.map((widget) =>
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

  function deleteWidgetFromDashboard(id: string) {
    if (!selectedDashboard) return;

    const widgetToBeDeleted = selectedDashboard.widgets.find(
      (widget) => widget.meta.id === id
    );

    if (!widgetToBeDeleted) return;

    const addComponentWidget = {
      name: 'Add component',
      type: 'ADD_COMPONENT',
      meta: {
        id: crypto.randomUUID(),
        position: {
          x: widgetToBeDeleted.meta.position.x,
          y: widgetToBeDeleted.meta.position.y,
          width: 12,
          height: 6
        }
      }
    };

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: [
        ...selectedDashboard.widgets.filter(
          (widget) => widget.meta.id !== id && widget.type !== 'ADD_COMPONENT'
        ),
        addComponentWidget
      ]
    };

    mutate(updatedDashboard, {
      revalidate: false
    });
  }

  if (dashboardPreferenceLoading || dashboardLoading) {
    return <SkeletonDashboard />;
  }

  if (!dashboardPreference?.id) {
    return <div>No dashboard selected</div>;
  }

  if (!selectedDashboard) {
    return <div>Dashboard not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">
          {selectedDashboard.name} / All teams
        </h1>

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
                      onClick={() => addWidgetToDashboard(component.type)}
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
        value={{
          addWidgetToDashboard
        }}
      >
        <ResponsiveGridLayout
          className="select-none"
          layout={layoutConfig}
          cols={24}
          rowHeight={50}
          isResizable={false}
          isDraggable={isEditing}
          onLayoutChange={(layout) => {
            const updatedDashboard = updateDashboardLayout(
              selectedDashboard,
              layout
            );

            mutate(updatedDashboard, {
              revalidate: false
            });
          }}
          draggableCancel=".non-draggable"
        >
          {selectedDashboard.widgets.map((widget) => (
            <div
              key={widget.meta.id}
              className={cn(
                'flex h-full w-full flex-col gap-2 overflow-auto rounded-sm border',
                isEditing && 'cursor-pointer',
                widget.type !== 'ADD_COMPONENT' && 'bg-white p-6'
              )}
            >
              {widget.type === 'ADD_COMPONENT' ? null : isEditing ? (
                <div className="non-draggable flex justify-between">
                  <EditableInput
                    value={widget.name}
                    onValueChange={(value) => {
                      changeWidgetName(widget.meta.id, value);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => deleteWidgetFromDashboard(widget.meta.id)}
                  >
                    <Trash className="h-6 w-6" />
                  </Button>
                </div>
              ) : (
                <h2 className="py-1 pr-3 text-lg font-medium">{widget.name}</h2>
              )}

              <DashboardComponent type={widget.type} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </DashboardContext.Provider>
    </div>
  );
}
