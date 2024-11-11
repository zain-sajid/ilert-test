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
  DragEndEvent
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import Item from './item';
import SortableItem from './sortable-item';
import LargeSortableItem from './large-sortable-item';

const App: FC = () => {
  const [items, setItems] = useState(
    Array.from({ length: 4 }, (_, i) => (i + 1).toString())
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
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
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="mx-auto my-24 flex max-w-[300px] flex-wrap gap-2.5">
          {items.map((id) => {
            return id === '2' ? (
              <LargeSortableItem key={id} id={id} />
            ) : (
              <SortableItem key={id} id={id} />
            );
          })}
        </div>
      </SortableContext>

      <DragOverlay className="bg-red-500">
        {activeId ? (
          <Item id={activeId} isDragging fullWidth={activeId === '2'} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
