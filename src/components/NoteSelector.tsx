import { Button } from '@/components/ui/button'
import type { NoteName } from '@/types'

interface NoteSelectorProps {
  onSelect: (note: NoteName) => void
  disabled?: boolean
}

const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const NOTE_KEYBOARD_HINTS: Record<NoteName, string> = {
  C: '1',
  D: '2',
  E: '3',
  F: '4',
  G: '5',
  A: '6',
  B: '7',
}

export function NoteSelector({ onSelect, disabled }: NoteSelectorProps) {
  return (
    <div className="flex gap-2 sm:gap-2.5 md:gap-3 flex-wrap justify-center px-2">
      {NOTE_NAMES.map((note) => (
        <Button
          key={note}
          onClick={() => onSelect(note)}
          disabled={disabled}
          size="lg"
          className="min-w-[52px] sm:min-w-[60px] md:min-w-16 h-14 sm:h-16 md:h-[68px] text-base sm:text-lg md:text-xl font-bold touch-manipulation"
          variant="outline"
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg sm:text-xl md:text-2xl">{note}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {NOTE_KEYBOARD_HINTS[note]}
            </span>
          </div>
        </Button>
      ))}
    </div>
  )
}
