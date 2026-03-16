"use client";

import { useState, useTransition } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Tables, ColumnId } from "@/lib/database.types";
import { KanbanCard } from "./card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KanbanColumnProps {
  columnId: ColumnId;
  issues: Tables<"issues">[];
  onAddIssue: (title: string) => Promise<void>;
}

export function KanbanColumn({
  columnId,
  issues,
  onAddIssue,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (isPending) return;
    const trimmed = title.trim();
    if (!trimmed) {
      handleCancel();
      return;
    }
    startTransition(async () => {
      await onAddIssue(trimmed);
      setTitle("");
      setIsAdding(false);
    });
  }

  function handleCancel() {
    setTitle("");
    setIsAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

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
      {isAdding ? (
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          placeholder="Issue title..."
          className="text-sm h-8"
          disabled={isPending}
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-foreground/40 hover:text-foreground/70 text-xs px-2"
          onClick={() => setIsAdding(true)}
        >
          + Add card
        </Button>
      )}
    </div>
  );
}
