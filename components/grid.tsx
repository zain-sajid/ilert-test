import React from 'react';

export default function Grid({
  children,
  columns
}: {
  columns: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mx-auto my-24 grid max-w-3xl gap-2.5"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
    >
      {children}
    </div>
  );
}
