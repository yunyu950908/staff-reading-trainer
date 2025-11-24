import { useState } from 'react'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { TrainingSession } from '@/features/training/TrainingSession'
import { StatsPanel } from '@/features/statistics/StatsPanel'
import { SetupPanel } from '@/features/training/SetupPanel'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { cardsAtom } from '@/store'

type ViewMode = 'training' | 'stats' | 'settings'

function App() {
  const { t } = useTranslation()
  const [cards] = useAtom(cardsAtom)
  const [viewMode, setViewMode] = useState<ViewMode>(
    cards.length === 0 ? 'settings' : 'training'
  )

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <header className="text-center space-y-1 sm:space-y-2 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {t('app.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('app.subtitle')}
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center px-2">
          <ToggleGroup
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            options={[
              {
                value: 'training',
                label: t('nav.training'),
                disabled: cards.length === 0
              },
              {
                value: 'stats',
                label: t('nav.statistics')
              },
              {
                value: 'settings',
                label: t('nav.settings')
              },
            ]}
            size="md"
          />
        </nav>

        {/* Main Content */}
        <main className="px-1 sm:px-2">
          {viewMode === 'training' && <TrainingSession />}
          {viewMode === 'stats' && <StatsPanel />}
          {viewMode === 'settings' && <SetupPanel />}
        </main>

        {/* Footer */}
        <footer className="text-center text-xs sm:text-sm text-muted-foreground pt-6 sm:pt-8 px-2">
          <p className="hidden sm:block">
            {t('app.footer.built')}
          </p>
          <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs">
            {t('app.footer.shortcuts')}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
