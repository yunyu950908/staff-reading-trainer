import type { Card, Rating, ReviewResult } from '@/types'

/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 * Reference: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 */

const RATING_QUALITY_MAP: Record<Rating, number> = {
  again: 0, // Complete blackout
  hard: 3,  // Correct response recalled with serious difficulty
  good: 4,  // Correct response after a hesitation
  easy: 5,  // Perfect response
}

export function reviewCard(card: Card, result: ReviewResult): Card {
  const quality = RATING_QUALITY_MAP[result.rating]
  let { easeFactor, interval, repetitions } = card

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  // Update repetitions and interval
  if (quality < 3) {
    // Failed - restart
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: new Date(),
  }
}

export function getDueCards(cards: Card[]): Card[] {
  const now = new Date()
  return cards.filter((card) => new Date(card.nextReviewDate) <= now)
}

export function getNewCards(cards: Card[], limit = 20): Card[] {
  return cards.filter((card) => card.repetitions === 0).slice(0, limit)
}
