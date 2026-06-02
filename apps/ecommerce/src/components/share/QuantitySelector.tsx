'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

export type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const [prevValue, setPrevValue] = React.useState(value)
  const [inputValue, setInputValue] = React.useState(String(value))

  if (value !== prevValue) {
    setPrevValue(value)
    setInputValue(String(value))
  }

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const commit = (raw: string) => {
    const n = parseInt(raw, 10)
    const clamped = isNaN(n) ? min : clamp(n)
    onChange(clamped)
    setInputValue(String(clamped))
  }

  return (
    <InputGroup className={cn('w-36', className)}>
      <InputGroupAddon align="inline-start">
        <InputGroupButton
          aria-label="Disminuir cantidad"
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1))}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Minus />
        </InputGroupButton>
      </InputGroupAddon>

      <InputGroupInput
        type="text"
        inputMode="numeric"
        value={inputValue}
        aria-label="Cantidad"
        className="text-center"
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Aumentar cantidad"
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1))}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Plus />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
