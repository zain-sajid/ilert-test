import React, { FC, HTMLAttributes } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import OpenAlerts from './open-alerts';

type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  fullWidth?: boolean;
  withOpacity?: boolean;
  isDragging?: boolean;
};

const SortableOpenAlerts: FC<ItemProps> = (props) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    width: '50%'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    >
      <OpenAlerts />
    </div>
  );
};

export default SortableOpenAlerts;
