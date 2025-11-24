import { nanoid } from 'nanoid'
import type { Card, Clef, TrainingConfig } from '@/types'
import { getAllNotes, getNotesInRange, getDefaultRange } from './notes'

export function createInitialCards(clef: Clef = 'treble'): Card[] {
  const notes = getAllNotes(clef)

  return notes.map((note) => ({
    id: nanoid(),
    note,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(),
  }))
}

export function createCardsFromRange(
  clef: Clef,
  startNote: string,
  endNote: string
): Card[] {
  const notes = getNotesInRange(clef, startNote, endNote)

  return notes.map((note) => ({
    id: nanoid(),
    note,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(),
  }))
}

export function initializeCards(trebleEnabled = true, bassEnabled = true): Card[] {
  const cards: Card[] = []

  if (trebleEnabled) {
    cards.push(...createInitialCards('treble'))
  }

  if (bassEnabled) {
    cards.push(...createInitialCards('bass'))
  }

  return cards
}

export function initializeCardsFromConfig(config: TrainingConfig): Card[] {
  const cards: Card[] = []

  for (const clef of config.enabledClefs) {
    const range = config.ranges[clef]
    if (range) {
      cards.push(...createCardsFromRange(clef, range.startNote, range.endNote))
    } else {
      // Fallback to default range
      const defaultRange = getDefaultRange(clef)
      cards.push(...createCardsFromRange(clef, defaultRange.start, defaultRange.end))
    }
  }

  return cards
}
