import { useMemo } from 'react'
import type { Clef, NoteRange } from '@/types'
import { getAllNotes, getNoteValue } from '@/lib/notes'

interface NoteRangePreviewProps {
  clef: Clef
  range?: NoteRange
}

export function NoteRangePreview({ clef, range }: NoteRangePreviewProps) {
  const allNotes = getAllNotes(clef)

  const noteInfo = useMemo(() => {
    if (!range) return []

    const startValue = getNoteValue({
      name: range.startNote.charAt(0) as any,
      octave: parseInt(range.startNote.slice(1)),
      clef,
    })
    const endValue = getNoteValue({
      name: range.endNote.charAt(0) as any,
      octave: parseInt(range.endNote.slice(1)),
      clef,
    })

    return allNotes.map((note) => {
      const noteValue = getNoteValue(note)
      const isInRange = noteValue >= startValue && noteValue <= endValue
      return {
        note: `${note.name}${note.octave}`,
        inRange: isInRange,
      }
    })
  }, [allNotes, range, clef])

  if (!range) return null

  return (
    <div className="mt-2">
      <div className="text-xs text-muted-foreground mb-2">
        {clef === 'treble' ? 'Treble Clef' : 'Bass Clef'} Range Preview
      </div>
      <div className="flex flex-wrap gap-1">
        {noteInfo.map((info, idx) => (
          <div
            key={`${info.note}-${idx}`}
            className={`
              px-2 py-1 rounded text-xs font-mono transition-colors
              ${
                info.inRange
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {info.note}
          </div>
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground mt-2">
        {range.startNote} → {range.endNote} ({noteInfo.filter((n) => n.inRange).length} notes)
      </div>
    </div>
  )
}
