'use client';

import { useContext } from 'react';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { components } from '@/data/components';
import { DashboardContext } from '@/context/dashboard';

export default function AddComponent() {
  const { addWidgetToDashboard } = useContext(DashboardContext);

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
                onClick={() => addWidgetToDashboard(component.type)}
              >
                {component.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
