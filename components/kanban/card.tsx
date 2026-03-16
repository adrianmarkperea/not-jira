"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Tables } from "@/lib/database.types";

interface KanbanCardProps {
  issue: Tables<"issues">;
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
    transform: CSS.Translate.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-blue-300 hover:shadow-md transition-shadow",
        isDragging &&
          "opacity-40 border-dashed border-2 border-blue-300 bg-blue-50",
      )}
      {...attributes}
      {...listeners}
    >
      <p className="text-sm font-medium break-all">{issue.title}</p>
      {issue.description && (
        <p className="text-xs text-foreground/60 mt-1 break-all">
          {issue.description}
        </p>
      )}
    </Card>
  );
}
