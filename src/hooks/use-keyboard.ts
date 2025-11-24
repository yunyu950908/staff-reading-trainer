import { useEffect } from 'react'

export type KeyHandler = (event: KeyboardEvent) => void

export interface KeyBinding {
  key: string
  handler: KeyHandler
  shift?: boolean
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
}

export function useKeyboard(bindings: KeyBinding[], enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const binding of bindings) {
        const keyMatch = event.key.toLowerCase() === binding.key.toLowerCase()
        const shiftMatch = binding.shift === undefined || event.shiftKey === binding.shift
        const ctrlMatch = binding.ctrl === undefined || event.ctrlKey === binding.ctrl
        const altMatch = binding.alt === undefined || event.altKey === binding.alt
        const metaMatch = binding.meta === undefined || event.metaKey === binding.meta

        if (keyMatch && shiftMatch && ctrlMatch && altMatch && metaMatch) {
          event.preventDefault()
          binding.handler(event)
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bindings, enabled])
}
