import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Position {
  x: number;
  y: number;
}

export function findLayoutGap(
  layout: LayoutItem[],
  newWidgetWidth: number,
  totalWidth: number = 24
): Position {
  if (!layout.length) {
    return { x: 0, y: 0 };
  }

  const findOverlappingWidgets = (x: number, width: number): LayoutItem[] => {
    return layout.filter((widget) => {
      const widgetRight = widget.x + widget.w;
      const targetRight = x + width;
      return !(widget.x >= targetRight || widgetRight <= x);
    });
  };

  const possibleX: number[] = [];
  for (let x = 0; x <= totalWidth - newWidgetWidth; x += newWidgetWidth) {
    possibleX.push(x);
  }

  let bestPosition: Position = { x: 0, y: Number.MAX_SAFE_INTEGER };

  possibleX.forEach((x) => {
    const overlapping = findOverlappingWidgets(x, newWidgetWidth);

    if (overlapping.length === 0) {
      bestPosition = { x, y: 0 };
      return;
    }

    const maxY = Math.max(...overlapping.map((w) => w.y + w.h));

    if (maxY < bestPosition.y) {
      bestPosition = { x, y: maxY };
    }
  });

  return bestPosition;
}
