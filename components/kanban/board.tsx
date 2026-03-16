"use client";

import { useState, useEffect, useOptimistic } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Tables, ColumnId, COLUMN_IDS } from "@/lib/database.types";
import { KanbanColumn } from "./column";
import { KanbanCard } from "./card";
import { updateIssuePosition, createIssue } from "@/actions/issues";

interface KanbanBoardProps {
  initialIssues: Tables<"issues">[];
}

type ColumnMap = Record<ColumnId, Tables<"issues">[]>;

function groupByColumn(issues: Tables<"issues">[]): ColumnMap {
  const map = Object.fromEntries(
    COLUMN_IDS.map((id) => [id, []]),
  ) as unknown as ColumnMap;
  for (const issue of issues) {
    const col = issue.column_id as ColumnId;
    if (map[col]) {
      map[col].push(issue);
    }
  }
  for (const col of COLUMN_IDS) {
    map[col].sort((a, b) => a.position - b.position);
  }
  return map;
}

function findColumnOfIssue(
  columns: ColumnMap,
  issueId: string,
): ColumnId | null {
  for (const col of COLUMN_IDS) {
    if (columns[col].some((i) => i.id === issueId)) return col;
  }
  return null;
}

export function KanbanBoard({ initialIssues }: KanbanBoardProps) {
  const [columns, setColumns] = useState<ColumnMap>(() =>
    groupByColumn(initialIssues),
  );
  const [activeIssue, setActiveIssue] = useState<Tables<"issues"> | null>(null);
  const [optimisticColumns, addOptimistic] = useOptimistic(
    columns,
    (
      state,
      { columnId, issue }: { columnId: ColumnId; issue: Tables<"issues"> },
    ) => ({
      ...state,
      [columnId]: [...state[columnId], issue],
    }),
  );

  useEffect(() => {
    setColumns(groupByColumn(initialIssues));
  }, [initialIssues]);

  async function handleAddIssue(title: string, columnId: ColumnId) {
    const tempIssue: Tables<"issues"> = {
      id: crypto.randomUUID(),
      title,
      column_id: columnId,
      position: columns[columnId].length + 1,
      user_id: "",
      description: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addOptimistic({ columnId, issue: tempIssue });
    await createIssue(title, columnId, columns[columnId].length + 1);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragStart({ active }: DragStartEvent) {
    const sourceCol = findColumnOfIssue(columns, active.id as string);
    if (!sourceCol) return;
    const issue = columns[sourceCol].find((i) => i.id === active.id);
    setActiveIssue(issue ?? null);
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceCol = findColumnOfIssue(columns, activeId);
    if (!sourceCol) return;

    const destCol = COLUMN_IDS.includes(overId as ColumnId)
      ? (overId as ColumnId)
      : findColumnOfIssue(columns, overId);

    if (!destCol || sourceCol === destCol) return;

    setColumns((prev) => {
      const sourceItems = prev[sourceCol].filter((i) => i.id !== activeId);
      const movedIssue = prev[sourceCol].find((i) => i.id === activeId)!;

      const overIndex = prev[destCol].findIndex((i) => i.id === overId);
      const destItems = [...prev[destCol]];
      if (overIndex >= 0) {
        destItems.splice(overIndex, 0, movedIssue);
      } else {
        destItems.push(movedIssue);
      }

      return { ...prev, [sourceCol]: sourceItems, [destCol]: destItems };
    });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveIssue(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceCol = findColumnOfIssue(columns, activeId);
    if (!sourceCol) return;

    const destCol = COLUMN_IDS.includes(overId as ColumnId)
      ? (overId as ColumnId)
      : findColumnOfIssue(columns, overId);

    if (!destCol) return;

    let newColumns = columns;

    if (sourceCol === destCol) {
      const items = columns[sourceCol];
      const oldIndex = items.findIndex((i) => i.id === activeId);
      const newIndex = items.findIndex((i) => i.id === overId);
      if (oldIndex !== newIndex) {
        newColumns = {
          ...columns,
          [sourceCol]: arrayMove(items, oldIndex, newIndex),
        };
        setColumns(newColumns);
      }
    }

    const destItems = newColumns[destCol];
    updateIssuePosition(
      activeId,
      destCol,
      destItems.map((i) => i.id),
    );
  }

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      collisionDetection={(args) => {
        const over = pointerWithin(args);
        return over.length > 0 ? over : closestCenter(args);
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMN_IDS.map((colId) => (
          <KanbanColumn
            key={colId}
            columnId={colId}
            issues={optimisticColumns[colId]}
            onAddIssue={(title) => handleAddIssue(title, colId)}
          />
        ))}
      </div>
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeIssue ? <KanbanCard issue={activeIssue} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
