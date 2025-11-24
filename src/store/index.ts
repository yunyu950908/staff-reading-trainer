import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { Card, Clef, StudyStats, TrainingConfig } from '@/types'
import { loadCards, loadStats, type StorageStats } from '@/lib/storage'
import { getDueCards, getNewCards } from '@/lib/srs'
import { getDefaultRange } from '@/lib/notes'

// Initialize cards from storage or create empty array
const initialCards = loadCards()

// Cards atom - persisted to localStorage
export const cardsAtom = atomWithStorage<Card[]>('staff-training-cards', initialCards)

// Current card being reviewed
export const currentCardAtom = atom<Card | null>(null)

// Selected clef for practice
export const selectedClefAtom = atomWithStorage<Clef>('selected-clef', 'treble')

// Language preference
export const languageAtom = atomWithStorage<string>('language', 'en')

// Training configuration
const trebleDefault = getDefaultRange('treble')
const bassDefault = getDefaultRange('bass')

export const trainingConfigAtom = atomWithStorage<TrainingConfig>(
  'training-config',
  {
    enabledClefs: ['treble', 'bass'],
    ranges: {
      treble: {
        clef: 'treble',
        startNote: trebleDefault.start,
        endNote: trebleDefault.end,
      },
      bass: {
        clef: 'bass',
        startNote: bassDefault.start,
        endNote: bassDefault.end,
      },
    },
    infiniteMode: false,
    fourNoteMode: false,
  }
)

// Stats atom
export const statsAtom = atomWithStorage<StorageStats>(
  'staff-training-stats',
  loadStats()
)

// Derived atoms
export const dueCardsAtom = atom((get) => {
  const cards = get(cardsAtom)
  return getDueCards(cards)
})

export const newCardsAtom = atom((get) => {
  const cards = get(cardsAtom)
  return getNewCards(cards)
})

export const studyStatsAtom = atom((get): StudyStats => {
  const cards = get(cardsAtom)
  const dueCards = get(dueCardsAtom)
  const newCards = get(newCardsAtom)
  const stats = get(statsAtom)

  const today = new Date().toDateString()
  const cardsStudiedToday =
    stats.lastReviewDate === today ? stats.reviewsToday : 0

  const accuracyRate =
    stats.totalReviews > 0
      ? Math.round((stats.correctReviews / stats.totalReviews) * 100)
      : 0

  return {
    totalCards: cards.length,
    newCards: newCards.length,
    learningCards: cards.filter((c) => c.repetitions > 0 && c.repetitions < 3).length,
    reviewCards: dueCards.length,
    cardsStudiedToday,
    accuracyRate,
  }
})
