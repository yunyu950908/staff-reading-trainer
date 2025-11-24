import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ToggleGroupOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

interface ToggleGroupProps {
  value: string
  options: ToggleGroupOption[]
  onChange: (value: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ToggleGroup({ value, options, onChange, className, size = 'md' }: ToggleGroupProps) {
  const sizeClasses = {
    sm: 'p-0.5 gap-0.5',
    md: 'p-1 gap-1',
    lg: 'p-1.5 gap-1.5',
  }

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-w-[70px]',
    md: 'px-4 py-2 text-sm min-w-[80px]',
    lg: 'px-5 py-2.5 text-base min-w-[100px]',
  }

  return (
    <div
      className={cn(
        'inline-flex rounded-lg border-2 border-border bg-background',
        sizeClasses[size],
        className
      )}
      role="group"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !option.disabled && onChange(option.value)}
          disabled={option.disabled}
          className={cn(
            'relative rounded-md font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'flex items-center justify-center gap-1.5',
            buttonSizeClasses[size],
            value === option.value
              ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-[1.02]'
              : 'bg-muted/30 hover:bg-muted text-foreground/60 hover:text-foreground',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-pressed={value === option.value}
        >
          {value === option.value && (
            <span className="text-current font-bold" aria-hidden="true">✓</span>
          )}
          {option.label}
        </button>
      ))}
    </div>
  )
}
