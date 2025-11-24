import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { studyStatsAtom } from '@/store'

export function StatsPanel() {
  const { t } = useTranslation()
  const [stats] = useAtom(studyStatsAtom)

  const statItems = [
    { label: t('statistics.totalCards'), value: stats.totalCards },
    { label: t('statistics.newCards'), value: stats.newCards },
    { label: t('statistics.learning'), value: stats.learningCards },
    { label: t('statistics.toReview'), value: stats.reviewCards },
    { label: t('statistics.studiedToday'), value: stats.cardsStudiedToday },
    { label: t('statistics.accuracy'), value: `${stats.accuracyRate}%` },
  ]

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">{t('statistics.title')}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {statItems.map((item) => (
            <div key={item.label} className="text-center p-3 sm:p-4 rounded-lg bg-muted/30">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
