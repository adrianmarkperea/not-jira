import { createClient } from '@/lib/supabase/server'
import { CounterDisplay } from './counter-display'


export default async function CounterPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("counter")
    .select("value")
    .single();

  if (error) {
    return <p>Failed to load counter</p>;
  }

  return <CounterDisplay value={data.value} />
}
