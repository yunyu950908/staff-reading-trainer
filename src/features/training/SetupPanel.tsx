import { useState } from 'react'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { cardsAtom, selectedClefAtom, trainingConfigAtom, languageAtom } from '@/store'
import { initializeCardsFromConfig } from '@/lib/init-cards'
import { getAllNotes, noteToString } from '@/lib/notes'
import { NoteRangePreview } from '@/components/NoteRangePreview'
import type { Clef } from '@/types'

export function SetupPanel() {
  const { t, i18n } = useTranslation()
  const [cards, setCards] = useAtom(cardsAtom)
  const [selectedClef, setSelectedClef] = useAtom(selectedClefAtom)
  const [config, setConfig] = useAtom(trainingConfigAtom)
  const [language, setLanguage] = useAtom(languageAtom)

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleInitialize = () => {
    const newCards = initializeCardsFromConfig(config)
    setCards(newCards)
  }

  const handleReset = () => {
    if (confirm(t('settings.cards.resetConfirm'))) {
      setCards([])
      localStorage.clear()
    }
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }

  const toggleClef = (clef: Clef) => {
    setConfig((prev) => {
      const enabledClefs = prev.enabledClefs.includes(clef)
        ? prev.enabledClefs.filter((c) => c !== clef)
        : [...prev.enabledClefs, clef]

      // Ensure at least one clef is enabled
      if (enabledClefs.length === 0) return prev

      return { ...prev, enabledClefs }
    })
  }

  const updateRange = (clef: Clef, startNote: string, endNote: string) => {
    setConfig((prev) => ({
      ...prev,
      ranges: {
        ...prev.ranges,
        [clef]: { clef, startNote, endNote },
      },
    }))
  }

  const trebleNotes = getAllNotes('treble')
  const bassNotes = getAllNotes('bass')

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">{t('settings.title')}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{t('settings.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 px-3 sm:px-6">
        {/* Language Selector */}
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.language.label')}</label>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
            {t('settings.language.description')}
          </p>
          <ToggleGroup
            value={language}
            onChange={handleLanguageChange}
            options={[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'English' },
            ]}
            size="sm"
          />
        </div>

        {/* Range Recommendations */}
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.rangeRecommendations.label')}</label>
          <div className="bg-muted/50 rounded-md p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {t('settings.rangeRecommendations.beginner.title')}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {t('settings.rangeRecommendations.beginner.description')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {t('settings.rangeRecommendations.intermediate.title')}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {t('settings.rangeRecommendations.intermediate.description')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {t('settings.rangeRecommendations.advanced.title')}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {t('settings.rangeRecommendations.advanced.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Infinite Mode Toggle */}
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.infiniteMode.label')}</label>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
            {t('settings.infiniteMode.description')}
          </p>
          <label className="flex items-center gap-2 sm:gap-3 cursor-pointer min-h-[44px] touch-manipulation">
            <input
              type="checkbox"
              checked={config.infiniteMode}
              onChange={(e) => setConfig({ ...config, infiniteMode: e.target.checked })}
              className="w-5 h-5 sm:w-4 sm:h-4"
            />
            <span className="text-xs sm:text-sm">{config.infiniteMode ? (language === 'zh' ? '已启用' : 'Enabled') : (language === 'zh' ? '已禁用' : 'Disabled')}</span>
          </label>
        </div>

        {/* Four Note Mode Toggle */}
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.fourNoteMode.label')}</label>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
            {t('settings.fourNoteMode.description')}
          </p>
          <label className="flex items-center gap-2 sm:gap-3 cursor-pointer min-h-[44px] touch-manipulation">
            <input
              type="checkbox"
              checked={config.fourNoteMode}
              onChange={(e) => setConfig({ ...config, fourNoteMode: e.target.checked })}
              className="w-5 h-5 sm:w-4 sm:h-4"
            />
            <span className="text-xs sm:text-sm">{config.fourNoteMode ? (language === 'zh' ? '已启用' : 'Enabled') : (language === 'zh' ? '已禁用' : 'Disabled')}</span>
          </label>
        </div>

        {/* Clef Selection for Training */}
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.currentClef.label')}</label>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
            {t('settings.currentClef.description')}
          </p>
          <ToggleGroup
            value={selectedClef}
            onChange={(value) => setSelectedClef(value as Clef)}
            options={[
              {
                value: 'treble',
                label: t('settings.currentClef.treble'),
                disabled: !config.enabledClefs.includes('treble')
              },
              {
                value: 'bass',
                label: t('settings.currentClef.bass'),
                disabled: !config.enabledClefs.includes('bass')
              },
            ]}
            size="md"
          />
        </div>

        {/* Advanced Settings Toggle */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-9 sm:h-10 text-xs sm:text-sm"
          >
            {showAdvanced ? t('settings.advancedSettings.hide') : t('settings.advancedSettings.show')}
          </Button>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.advancedSettings.enabledClefs.label')}</label>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                {t('settings.advancedSettings.enabledClefs.description')}
              </p>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer min-h-[44px] touch-manipulation">
                  <input
                    type="checkbox"
                    checked={config.enabledClefs.includes('treble')}
                    onChange={() => toggleClef('treble')}
                    className="w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm">{t('settings.currentClef.treble')}</span>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer min-h-[44px] touch-manipulation">
                  <input
                    type="checkbox"
                    checked={config.enabledClefs.includes('bass')}
                    onChange={() => toggleClef('bass')}
                    className="w-5 h-5 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm">{t('settings.currentClef.bass')}</span>
                </label>
              </div>
            </div>

            {/* Treble Clef Range */}
            {config.enabledClefs.includes('treble') && config.ranges.treble && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.advancedSettings.trebleRange.label')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">{t('settings.advancedSettings.trebleRange.startNote')}</label>
                    <select
                      value={config.ranges.treble.startNote}
                      onChange={(e) =>
                        updateRange('treble', e.target.value, config.ranges.treble!.endNote)
                      }
                      className="w-full p-2.5 sm:p-2 border rounded-md bg-background text-sm sm:text-base min-h-[44px] sm:min-h-0"
                    >
                      {trebleNotes.map((note) => (
                        <option key={noteToString(note)} value={noteToString(note)}>
                          {noteToString(note)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">{t('settings.advancedSettings.trebleRange.endNote')}</label>
                    <select
                      value={config.ranges.treble.endNote}
                      onChange={(e) =>
                        updateRange('treble', config.ranges.treble!.startNote, e.target.value)
                      }
                      className="w-full p-2.5 sm:p-2 border rounded-md bg-background text-sm sm:text-base min-h-[44px] sm:min-h-0"
                    >
                      {trebleNotes.map((note) => (
                        <option key={noteToString(note)} value={noteToString(note)}>
                          {noteToString(note)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <NoteRangePreview clef="treble" range={config.ranges.treble} />
              </div>
            )}

            {/* Bass Clef Range */}
            {config.enabledClefs.includes('bass') && config.ranges.bass && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">{t('settings.advancedSettings.bassRange.label')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">{t('settings.advancedSettings.bassRange.startNote')}</label>
                    <select
                      value={config.ranges.bass.startNote}
                      onChange={(e) =>
                        updateRange('bass', e.target.value, config.ranges.bass!.endNote)
                      }
                      className="w-full p-2.5 sm:p-2 border rounded-md bg-background text-sm sm:text-base min-h-[44px] sm:min-h-0"
                    >
                      {bassNotes.map((note) => (
                        <option key={noteToString(note)} value={noteToString(note)}>
                          {noteToString(note)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">{t('settings.advancedSettings.bassRange.endNote')}</label>
                    <select
                      value={config.ranges.bass.endNote}
                      onChange={(e) =>
                        updateRange('bass', config.ranges.bass!.startNote, e.target.value)
                      }
                      className="w-full p-2.5 sm:p-2 border rounded-md bg-background text-sm sm:text-base min-h-[44px] sm:min-h-0"
                    >
                      {bassNotes.map((note) => (
                        <option key={noteToString(note)} value={noteToString(note)}>
                          {noteToString(note)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <NoteRangePreview clef="bass" range={config.ranges.bass} />
              </div>
            )}
          </div>
        )}

        {/* Initialize/Reset */}
        {cards.length === 0 ? (
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              {t('settings.cards.noCards')}
            </p>
            <Button
              onClick={handleInitialize}
              className="h-10 sm:h-11 text-sm sm:text-base"
            >
              {t('settings.cards.initialize')}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              {t('settings.cards.cardCount', { count: cards.length })}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleInitialize}
                variant="outline"
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                {t('settings.cards.reinitialize')}
              </Button>
              <Button
                onClick={handleReset}
                variant="destructive"
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                {t('settings.cards.reset')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
