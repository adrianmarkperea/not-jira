"use client"

import { increment, decrement } from '@/actions/counter'


export function CounterDisplay({ value }: { value: number }) {
  return (
    <div>
      <span>{value}</span>
      <button onClick={() => decrement()}>Subtract</button>
      <button onClick={() => increment()}>Add</button>
    </div>
  )
}
