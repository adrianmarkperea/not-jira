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
