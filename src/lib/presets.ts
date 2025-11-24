import type { TrainingConfig } from '@/types'

export interface ConfigPreset {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  config: TrainingConfig
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    nameZh: '初学者',
    description: 'Practice central C area (C4-G4 for treble, F3-C4 for bass)',
    descriptionZh: '练习中央C区域（高音谱C4-G4，低音谱F3-C4）',
    config: {
      enabledClefs: ['treble', 'bass'],
      ranges: {
        treble: {
          clef: 'treble',
          startNote: 'C4',
          endNote: 'G4',
        },
        bass: {
          clef: 'bass',
          startNote: 'F3',
          endNote: 'C4',
        },
      },
      infiniteMode: false,
    },
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    nameZh: '中级',
    description: 'Expand to two octaves (C4-C6 for treble, C2-C4 for bass)',
    descriptionZh: '扩展到两个八度（高音谱C4-C6，低音谱C2-C4）',
    config: {
      enabledClefs: ['treble', 'bass'],
      ranges: {
        treble: {
          clef: 'treble',
          startNote: 'C4',
          endNote: 'C6',
        },
        bass: {
          clef: 'bass',
          startNote: 'C2',
          endNote: 'C4',
        },
      },
      infiniteMode: false,
    },
  },
  {
    id: 'advanced',
    name: 'Advanced',
    nameZh: '高级',
    description: 'Full range practice (C4-E6 for treble, E2-G4 for bass)',
    descriptionZh: '全音域练习（高音谱C4-E6，低音谱E2-G4）',
    config: {
      enabledClefs: ['treble', 'bass'],
      ranges: {
        treble: {
          clef: 'treble',
          startNote: 'C4',
          endNote: 'E6',
        },
        bass: {
          clef: 'bass',
          startNote: 'E2',
          endNote: 'G4',
        },
      },
      infiniteMode: false,
    },
  },
  {
    id: 'treble-only',
    name: 'Treble Only',
    nameZh: '仅高音谱',
    description: 'Practice treble clef only (C4-E6)',
    descriptionZh: '仅练习高音谱号（C4-E6）',
    config: {
      enabledClefs: ['treble'],
      ranges: {
        treble: {
          clef: 'treble',
          startNote: 'C4',
          endNote: 'E6',
        },
      },
      infiniteMode: false,
    },
  },
  {
    id: 'bass-only',
    name: 'Bass Only',
    nameZh: '仅低音谱',
    description: 'Practice bass clef only (E2-G4)',
    descriptionZh: '仅练习低音谱号（E2-G4）',
    config: {
      enabledClefs: ['bass'],
      ranges: {
        bass: {
          clef: 'bass',
          startNote: 'E2',
          endNote: 'G4',
        },
      },
      infiniteMode: false,
    },
  },
]
