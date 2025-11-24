import type { Note, NoteName, Clef } from '@/types'

const TREBLE_NOTES: Array<{ name: NoteName; octave: number }> = [
  // Ledger lines below
  { name: 'C', octave: 4 },
  { name: 'D', octave: 4 },
  // Staff lines and spaces
  { name: 'E', octave: 4 },
  { name: 'F', octave: 4 },
  { name: 'G', octave: 4 },
  { name: 'A', octave: 4 },
  { name: 'B', octave: 4 },
  { name: 'C', octave: 5 },
  { name: 'D', octave: 5 },
  { name: 'E', octave: 5 },
  { name: 'F', octave: 5 },
  { name: 'G', octave: 5 },
  { name: 'A', octave: 5 },
  { name: 'B', octave: 5 },
  { name: 'C', octave: 6 },
  // Ledger lines above
  { name: 'D', octave: 6 },
  { name: 'E', octave: 6 },
]

const BASS_NOTES: Array<{ name: NoteName; octave: number }> = [
  // Ledger lines below
  { name: 'E', octave: 2 },
  { name: 'F', octave: 2 },
  // Staff lines and spaces
  { name: 'G', octave: 2 },
  { name: 'A', octave: 2 },
  { name: 'B', octave: 2 },
  { name: 'C', octave: 3 },
  { name: 'D', octave: 3 },
  { name: 'E', octave: 3 },
  { name: 'F', octave: 3 },
  { name: 'G', octave: 3 },
  { name: 'A', octave: 3 },
  { name: 'B', octave: 3 },
  { name: 'C', octave: 4 },
  { name: 'D', octave: 4 },
  { name: 'E', octave: 4 },
  // Ledger lines above
  { name: 'F', octave: 4 },
  { name: 'G', octave: 4 },
]

export function getAllNotes(clef: Clef): Note[] {
  const noteList = clef === 'treble' ? TREBLE_NOTES : BASS_NOTES
  return noteList.map((n) => ({ ...n, clef }))
}

export function getRandomNote(clef: Clef): Note {
  const notes = getAllNotes(clef)
  return notes[Math.floor(Math.random() * notes.length)]
}

export function noteToString(note: Note): string {
  return `${note.name}${note.octave}`
}

export function noteToVexFlowKey(note: Note): string {
  return `${note.name.toLowerCase()}/${note.octave}`
}

export function areNotesEqual(note1: Note, note2: Note): boolean {
  return (
    note1.name === note2.name &&
    note1.octave === note2.octave &&
    note1.clef === note2.clef
  )
}

export function parseNoteString(noteStr: string): { name: NoteName; octave: number } | null {
  const match = noteStr.match(/^([A-G])(\d+)$/)
  if (!match) return null
  return {
    name: match[1] as NoteName,
    octave: parseInt(match[2], 10),
  }
}

export function getNoteValue(note: Note): number {
  // Convert note to a numeric value for comparison
  // C=0, D=2, E=4, F=5, G=7, A=9, B=11
  const noteValues: Record<NoteName, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  }
  return note.octave * 12 + noteValues[note.name]
}

export function isNoteInRange(note: Note, startNote: string, endNote: string): boolean {
  const start = parseNoteString(startNote)
  const end = parseNoteString(endNote)
  if (!start || !end) return true // If parsing fails, include all notes

  const noteValue = getNoteValue(note)
  const startValue = getNoteValue({ ...start, clef: note.clef })
  const endValue = getNoteValue({ ...end, clef: note.clef })

  return noteValue >= startValue && noteValue <= endValue
}

export function getNotesInRange(clef: Clef, startNote: string, endNote: string): Note[] {
  const allNotes = getAllNotes(clef)
  return allNotes.filter((note) => isNoteInRange(note, startNote, endNote))
}

export function getDefaultRange(clef: Clef): { start: string; end: string } {
  if (clef === 'treble') {
    return { start: 'C4', end: 'E6' }
  } else {
    return { start: 'E2', end: 'G4' }
  }
}
