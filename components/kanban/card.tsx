'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Tables } from '@/lib/database.types';

interface KanbanCardProps {
  issue: Tables<'issues'>;
}

export function KanbanCard({ issue }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 cursor-grab active:cursor-grabbing select-none"
      {...attributes}
      {...listeners}
    >
      <p className="text-sm font-medium">{issue.title}</p>
      {issue.description && (
        <p className="text-xs text-foreground/60 mt-1">{issue.description}</p>
      )}
    </Card>
  );
}
