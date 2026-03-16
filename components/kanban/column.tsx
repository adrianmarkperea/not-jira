"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Tables, ColumnId } from "@/lib/database.types";
import { KanbanCard } from "./card";

interface KanbanColumnProps {
  columnId: ColumnId;
  issues: Tables<"issues">[];
}

export function KanbanColumn({ columnId, issues }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div className="flex flex-col gap-2 min-w-[220px] w-[220px]">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-foreground/80">{columnId}</h2>
        <span className="text-xs text-foreground/40">{issues.length}</span>
      </div>
      <SortableContext
        items={issues.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "flex flex-col gap-2 rounded-lg p-2 min-h-[100px] transition-colors",
            isOver ? "bg-foreground/5" : "bg-foreground/[0.02]",
          )}
        >
          {issues.map((issue) => (
            <KanbanCard key={issue.id} issue={issue} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
