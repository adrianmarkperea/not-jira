"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { COLUMN_IDS, ColumnId } from "@/lib/database.types";

export async function updateIssuePosition(
  issueId: string,
  newColumnId: ColumnId,
  orderedIssueIds: string[],
): Promise<void> {
  if (!COLUMN_IDS.includes(newColumnId)) {
    throw new Error(`Invalid column: ${newColumnId}`);
  }

  const supabase = await createClient();

  await Promise.all(
    orderedIssueIds.map((id, index) =>
      supabase
        .from("issues")
        .update({ column_id: newColumnId, position: index + 1 })
        .eq("id", id),
    ),
  );

  // Also update the moved issue's column if it's not in the ordered list
  // (edge case: orderedIssueIds may only contain destination column IDs)
  if (!orderedIssueIds.includes(issueId)) {
    await supabase
      .from("issues")
      .update({ column_id: newColumnId, position: orderedIssueIds.length + 1 })
      .eq("id", issueId);
  }

  revalidatePath("/protected");
}

export async function createIssue(
  title: string,
  columnId: ColumnId,
  position: number,
): Promise<void> {
  if (!COLUMN_IDS.includes(columnId)) {
    throw new Error(`Invalid column: ${columnId}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  await supabase.from("issues").insert({
    title,
    column_id: columnId,
    position,
    user_id: user.id,
  });

  revalidatePath("/protected");
}
