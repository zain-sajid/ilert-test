'use client';

import { useContext } from 'react';
import { Plus } from 'lucide-react';
import { findLayoutGap } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { components, DashboardContext } from '@/components/dashboard';

export default function AddComponent({
  id,
  position
}: {
  id: string;
  position: any;
}) {
  const { selectedDashboard, layoutConfig, mutate } =
    useContext(DashboardContext);

  const addComponentToLayout = (type: string) => {
    const newWidget = {
      name:
        components.find((component) => component.type === type)?.name ||
        'Widget',
      type,
      meta: {
        id: crypto.randomUUID(),
        position: {
          x: position.x,
          y: position.y,
          width: 12,
          height: 6
        }
      }
    };

    const newPosition = findLayoutGap(layoutConfig, 12);
    const newAddWidget = {
      name: 'Add component',
      type: 'ADD_COMPONENT',
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
        widgets: [
          ...selectedDashboard.widgets.filter((w: any) => w.meta.id !== id),
          newWidget,
          newAddWidget
        ]
      },
      {
        revalidate: false
      }
    );
  };
  return (
    <div className="non-draggable h-full w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex h-full w-full cursor-pointer items-center justify-center border-2 border-dashed">
            <Plus className="h-10 w-10" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center">
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
    </div>
  );
}
