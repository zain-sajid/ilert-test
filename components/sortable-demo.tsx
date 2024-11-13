'use client';

import React, { FC, useState, useCallback } from 'react';

import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import { restrictToParentElement } from '@dnd-kit/modifiers';
import SortableOpenAlerts from './sortable-open-alerts';
import LargeSortableItem from './large-sortable-item';
import OpenAlerts from './open-alerts';

type Component = {
  id: string;
  component: React.ReactNode;
};

const App: FC = () => {
  // const [items, setItems] = useState<Component[]>(
  //   [...Array(2)].map((i, index) => ({
  //     id: (index + 1).toString(),
  //     component: (
  //       <SortableOpenAlerts
  //         key={(index + 1).toString()}
  //         id={(index + 1).toString()}
  //       />
  //     )
  //   }))
  // );
  const [items, setItems] = useState<Component[]>([
    {
      id: '1',
      component: <LargeSortableItem key="1" id="1" />
    },
    {
      id: '2',
      component: <SortableOpenAlerts key="2" id="2" />
    }
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeComponent = items.find((c) => c.id === activeId)?.component;

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="mx-auto my-24 flex w-full max-w-4xl flex-wrap gap-2.5">
          {items.map((c) => {
            return c.component;
          })}
        </div>
      </SortableContext>

      <DragOverlay>{activeComponent ? activeComponent : null}</DragOverlay>
    </DndContext>
  );
};

export default App;
