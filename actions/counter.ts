"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'


export async function increment() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("counter")
    .select("*")
    .single();

  await supabase
    .from("counter")
    .update({ value: data!.value + 1 })
    .eq("id", data!.id)

  revalidatePath("/counter")
}


export async function decrement() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("counter")
    .select("*")
    .single();

  await supabase
    .from("counter")
    .update({ value: data!.value - 1 })
    .eq("id", data!.id)

  revalidatePath("/counter")
}
