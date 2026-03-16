"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useDroppable, useDndMonitor } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Tables, ColumnId } from "@/lib/database.types";
import { KanbanCard } from "./card";
import { Button } from "@/components/ui/button";

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
  const { setNodeRef: setDroppableRef } = useDroppable({ id: columnId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  useDndMonitor({
    onDragOver({ over }) {
      const isOver =
        over?.id === columnId || issues.some((i) => i.id === over?.id);
      setIsDragOver(isOver);
    },
    onDragEnd() {
      setIsDragOver(false);
    },
    onDragCancel() {
      setIsDragOver(false);
    },
  });

  function handleCancel() {
    setTitle("");
    setIsAdding(false);
  }

  function handleSubmit(closeAfterSubmit = false) {
    if (isPending) return;
    const trimmed = title.trim();
    if (!trimmed) {
      handleCancel();
      return;
    }
    startTransition(async () => {
      await onAddIssue(trimmed);
      setTitle("");
      if (closeAfterSubmit) setIsAdding(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    });
  }

  useEffect(() => {
    if (!isAdding) return;
    function handleMouseDown(e: MouseEvent) {
      if (columnRef.current && !columnRef.current.contains(e.target as Node)) {
        handleSubmit(true);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isAdding, title, isPending]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  return (
    <div ref={columnRef} className="flex flex-col min-w-[220px] w-[220px]">
      <div className="flex items-center justify-between px-1 mb-2">
        <h2 className="text-sm font-semibold text-foreground/80">{columnId}</h2>
        <span className="text-xs text-foreground/40">{issues.length}</span>
      </div>

      <div
        ref={setDroppableRef}
        className={cn(
          "flex flex-col rounded-lg transition-colors",
          isDragOver
            ? "bg-blue-50 ring-2 ring-blue-300 ring-inset"
            : "bg-white/60",
        )}
      >
        <SortableContext
          items={issues.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={scrollRef}
            className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-15rem)] min-h-[80px]"
          >
            {issues.map((issue) => (
              <KanbanCard key={issue.id} issue={issue} />
            ))}
          </div>
        </SortableContext>

        <div className="p-2 pt-0">
          {isAdding ? (
            <>
              <textarea
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Issue title..."
                rows={2}
                disabled={isPending}
                className="w-full resize-none rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmit()}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add card
                </Button>
                <button
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-600 text-lg leading-none px-1"
                  aria-label="Cancel"
                >
                  ✕
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full text-left text-xs text-foreground/40 hover:text-foreground/70 px-1 py-1"
            >
              + Add card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
