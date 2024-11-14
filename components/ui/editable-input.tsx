'use client';

import { Input } from '@/components/ui/input';
import { Button } from './button';
import { Check, Pencil, X } from 'lucide-react';
import { useState } from 'react';

export default function EditableInput({
  value,
  onValueChange
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (editValue.trim()) {
      onValueChange(editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="max-w-[500px]">
      {isEditing ? (
        <form className="relative flex flex-col" onSubmit={handleSubmit}>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            type="text"
            className="font-medium md:text-lg"
            autoFocus
          />
          <div className="absolute -bottom-1 right-0 w-fit translate-y-full self-end rounded-md border bg-white shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleSubmit()}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div
          className="group flex cursor-pointer items-center justify-between px-3 py-1 text-lg font-medium hover:bg-neutral-100"
          onClick={() => setIsEditing(true)}
        >
          {value}
          {!isEditing && (
            <Pencil className="hidden h-4 w-4 group-hover:block" />
          )}
        </div>
      )}
    </div>
  );
}
