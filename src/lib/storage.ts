import type { Card } from '@/types'

const STORAGE_KEY = 'staff-training-cards'
const STATS_KEY = 'staff-training-stats'

export interface StorageStats {
  reviewsToday: number
  lastReviewDate: string
  totalReviews: number
  correctReviews: number
}

export function saveCards(cards: Card[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  } catch (error) {
    console.error('Failed to save cards:', error)
  }
}

export function loadCards(): Card[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const cards = JSON.parse(data)
    // Convert date strings back to Date objects
    return cards.map((card: Card) => ({
      ...card,
      nextReviewDate: new Date(card.nextReviewDate),
      lastReviewDate: card.lastReviewDate
        ? new Date(card.lastReviewDate)
        : undefined,
    }))
  } catch (error) {
    console.error('Failed to load cards:', error)
    return []
  }
}

export function saveStats(stats: StorageStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Failed to save stats:', error)
  }
}

export function loadStats(): StorageStats {
  try {
    const data = localStorage.getItem(STATS_KEY)
    if (!data) {
      return {
        reviewsToday: 0,
        lastReviewDate: new Date().toDateString(),
        totalReviews: 0,
        correctReviews: 0,
      }
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to load stats:', error)
    return {
      reviewsToday: 0,
      lastReviewDate: new Date().toDateString(),
      totalReviews: 0,
      correctReviews: 0,
    }
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STATS_KEY)
}
