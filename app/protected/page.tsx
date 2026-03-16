import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/kanban/board";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .order("position");

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold">Board</h1>
      <KanbanBoard initialIssues={issues ?? []} />
    </div>
  );
}
