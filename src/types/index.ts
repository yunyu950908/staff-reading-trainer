export type Clef = 'treble' | 'bass'

export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

export interface Note {
  name: NoteName
  octave: number
  clef: Clef
}

export interface NoteRange {
  clef: Clef
  startNote: string  // e.g., "C4"
  endNote: string    // e.g., "E5"
}

export interface TrainingConfig {
  enabledClefs: Clef[]
  ranges: {
    treble?: NoteRange
    bass?: NoteRange
  }
  infiniteMode: boolean
  fourNoteMode: boolean
}

export interface Card {
  id: string
  note: Note
  // SM-2 algorithm fields
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
  lastReviewDate?: Date
}

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface ReviewResult {
  rating: Rating
  timeSpent: number
}

export interface StudyStats {
  totalCards: number
  newCards: number
  learningCards: number
  reviewCards: number
  cardsStudiedToday: number
  accuracyRate: number
}
