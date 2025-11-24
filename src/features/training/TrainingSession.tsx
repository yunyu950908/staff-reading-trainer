import { useState, useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { StaffNotation } from '@/components/StaffNotation'
import { NoteSelector } from '@/components/NoteSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cardsAtom, statsAtom, selectedClefAtom, trainingConfigAtom, languageAtom } from '@/store'
import { reviewCard, getDueCards } from '@/lib/srs'
import { areNotesEqual } from '@/lib/notes'
import { useKeyboard } from '@/hooks/use-keyboard'
import type { NoteName, Rating } from '@/types'
import { shuffle } from 'lodash'

export function TrainingSession() {
  const { t } = useTranslation()
  const [cards, setCards] = useAtom(cardsAtom)
  const setStats = useSetAtom(statsAtom)
  const [selectedClef] = useAtom(selectedClefAtom)
  const [config] = useAtom(trainingConfigAtom)
  const [language] = useAtom(languageAtom)

  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionStartTime] = useState(Date.now())

  // Four note mode state
  const [userAnswers, setUserAnswers] = useState<NoteName[]>([])

  // Get cards for current session
  const sessionCards = useMemo(() => {
    if (config.infiniteMode) {
      // In infinite mode, include all cards for the selected clef
      const allCards = cards.filter((c) => c.note.clef === selectedClef)
      return shuffle(allCards)
    } else {
      // Normal mode: only due cards and new cards
      const dueCards = getDueCards(cards).filter((c) => c.note.clef === selectedClef)
      const newCards = cards
        .filter((c) => c.repetitions === 0 && c.note.clef === selectedClef)
        .slice(0, 10)

      return shuffle([...dueCards, ...newCards])
    }
  }, [cards, selectedClef, config.infiniteMode])

  const currentCard = sessionCards[currentCardIndex]

  // For four note mode, get 4 cards at once
  const currentCards = config.fourNoteMode
    ? sessionCards.slice(currentCardIndex, currentCardIndex + 4)
    : [currentCard].filter(Boolean)

  useEffect(() => {
    if (!currentCard) return
    setShowFeedback(false)
    setIsCorrect(false)
    setUserAnswers([])
  }, [currentCard])

  const handleAnswer = (noteName: NoteName) => {
    if (!currentCard || showFeedback) return

    if (config.fourNoteMode) {
      // Four note mode logic
      const newAnswers = [...userAnswers, noteName]
      setUserAnswers(newAnswers)

      if (newAnswers.length === currentCards.length) {
        // All notes answered, check if all correct
        const allCorrect = currentCards.every((card, idx) =>
          areNotesEqual(card.note, { ...card.note, name: newAnswers[idx] })
        )
        setIsCorrect(allCorrect)
        setShowFeedback(true)
      }
    } else {
      // Single note mode logic
      const correct = areNotesEqual(
        currentCard.note,
        { ...currentCard.note, name: noteName }
      )
      setIsCorrect(correct)
      setShowFeedback(true)
    }
  }

  const handleRetry = () => {
    setShowFeedback(false)
    setIsCorrect(false)
    setUserAnswers([])
  }

  const handleRating = (rating: Rating) => {
    if (!currentCard) return

    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000)

    if (config.fourNoteMode) {
      // Update all four cards
      const updatedCards = currentCards.map((card) => reviewCard(card, { rating, timeSpent }))

      setCards((prev) =>
        prev.map((c) => {
          const updated = updatedCards.find((uc) => uc.id === c.id)
          return updated || c
        })
      )

      // Update stats
      const today = new Date().toDateString()
      setStats((prev) => ({
        ...prev,
        reviewsToday: prev.lastReviewDate === today ? prev.reviewsToday + currentCards.length : currentCards.length,
        lastReviewDate: today,
        totalReviews: prev.totalReviews + currentCards.length,
        correctReviews: prev.correctReviews + (isCorrect ? currentCards.length : 0),
      }))

      // Move to next set of 4 cards
      const nextIndex = currentCardIndex + 4
      if (nextIndex < sessionCards.length) {
        setCurrentCardIndex(nextIndex)
      } else {
        setCurrentCardIndex(0)
      }
    } else {
      // Single card logic
      const updatedCard = reviewCard(currentCard, { rating, timeSpent })

      setCards((prev) =>
        prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
      )

      const today = new Date().toDateString()
      setStats((prev) => ({
        ...prev,
        reviewsToday: prev.lastReviewDate === today ? prev.reviewsToday + 1 : 1,
        lastReviewDate: today,
        totalReviews: prev.totalReviews + 1,
        correctReviews: prev.correctReviews + (isCorrect ? 1 : 0),
      }))

      // Move to next card
      if (currentCardIndex < sessionCards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1)
      } else {
        setCurrentCardIndex(0)
      }
    }

    setShowFeedback(false)
  }

  const handleContinue = () => {
    handleRating('again')
  }

  // Keyboard shortcuts
  useKeyboard(
    [
      { key: '1', handler: () => !showFeedback && handleAnswer('C') },
      { key: '2', handler: () => !showFeedback && handleAnswer('D') },
      { key: '3', handler: () => !showFeedback && handleAnswer('E') },
      { key: '4', handler: () => !showFeedback && handleAnswer('F') },
      { key: '5', handler: () => !showFeedback && handleAnswer('G') },
      { key: '6', handler: () => !showFeedback && handleAnswer('A') },
      { key: '7', handler: () => !showFeedback && handleAnswer('B') },
      { key: 'r', handler: () => showFeedback && !isCorrect && handleRetry() },
      { key: 'R', handler: () => showFeedback && !isCorrect && handleRetry() },
      { key: 'Enter', handler: () => showFeedback && (isCorrect ? handleRating('good') : handleContinue()) },
      { key: ' ', handler: () => showFeedback && (isCorrect ? handleRating('good') : handleContinue()) },
    ],
    currentCard !== null
  )

  if (!currentCard) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('training.noCards.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('training.noCards.message')}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Check if we have enough cards for four note mode
  if (config.fourNoteMode && currentCards.length < 4) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('training.noCards.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm sm:text-base">
            {language === 'zh'
              ? '四音符模式需要至少4张卡片。请在设置中添加更多卡片或禁用四音符模式。'
              : 'Four Note Mode requires at least 4 cards. Please add more cards in settings or disable Four Note Mode.'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-center text-lg sm:text-xl md:text-2xl">
          {config.fourNoteMode ? t('training.titleFourNote') : t('training.title')}
          <span className="ml-2 text-xs sm:text-sm text-muted-foreground block sm:inline mt-1 sm:mt-0">
            ({currentCardIndex + 1} / {sessionCards.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 px-3 sm:px-6">
        <div className="flex justify-center w-full">
          {config.fourNoteMode ? (
            <StaffNotation notes={currentCards.map(c => c.note)} />
          ) : (
            <StaffNotation note={currentCard.note} />
          )}
        </div>

        {config.fourNoteMode && !showFeedback && (
          <div className="text-center text-sm text-muted-foreground">
            {t('training.feedback.answerCount', { current: userAnswers.length + 1, total: currentCards.length })}
          </div>
        )}

        {showFeedback && (
          <div
            className={`text-center text-base sm:text-lg font-semibold px-2 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect
              ? t('training.feedback.correct')
              : config.fourNoteMode
                ? t('training.feedback.wrongFourNote', { answers: currentCards.map(c => c.note.name).join(', ') })
                : t('training.feedback.wrong', { answer: currentCard.note.name })
            }
          </div>
        )}

        <NoteSelector
          onSelect={handleAnswer}
          disabled={showFeedback}
        />

        {showFeedback && isCorrect && (
          <div className="space-y-3">
            <p className="text-center text-xs sm:text-sm text-muted-foreground px-2">
              {t('training.feedback.difficulty')}
            </p>
            <div className="flex gap-2 justify-center flex-wrap px-2">
              <Button
                onClick={() => handleRating('again')}
                variant="outline"
                size="sm"
                className="min-w-[70px] sm:min-w-[80px] h-9 sm:h-10 text-xs sm:text-sm"
              >
                {t('training.rating.again')}
              </Button>
              <Button
                onClick={() => handleRating('hard')}
                variant="outline"
                size="sm"
                className="min-w-[70px] sm:min-w-[80px] h-9 sm:h-10 text-xs sm:text-sm"
              >
                {t('training.rating.hard')}
              </Button>
              <Button
                onClick={() => handleRating('good')}
                size="sm"
                className="min-w-[70px] sm:min-w-[80px] h-9 sm:h-10 text-xs sm:text-sm"
              >
                {t('training.rating.good')}
              </Button>
              <Button
                onClick={() => handleRating('easy')}
                variant="outline"
                size="sm"
                className="min-w-[70px] sm:min-w-[80px] h-9 sm:h-10 text-xs sm:text-sm"
              >
                {t('training.rating.easy')}
              </Button>
            </div>
          </div>
        )}

        {showFeedback && !isCorrect && (
          <div className="space-y-3">
            <p className="text-center text-xs sm:text-sm text-muted-foreground px-2">
              {t('training.feedback.whatToDo')}
            </p>
            <div className="flex gap-2 sm:gap-3 justify-center flex-wrap px-2">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="min-w-[120px] sm:min-w-[140px] h-10 sm:h-11 text-sm sm:text-base"
              >
                {t('training.actions.retry')}
              </Button>
              <Button
                onClick={handleContinue}
                className="min-w-[120px] sm:min-w-[140px] h-10 sm:h-11 text-sm sm:text-base"
              >
                {t('training.actions.continue')}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground px-2 pb-2">
          {!showFeedback ? (
            <p>{t('training.hints.keyboard')}</p>
          ) : isCorrect ? (
            <p>{t('training.hints.ratingHint')}</p>
          ) : (
            <p>{t('training.hints.wrongHint')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
