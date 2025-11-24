import { useEffect, useRef, useState } from 'react'
import { Renderer, Stave, StaveNote, Formatter } from 'vexflow'
import type { Note } from '@/types'
import { noteToVexFlowKey } from '@/lib/notes'

interface StaffNotationProps {
  note?: Note
  notes?: Note[]
  width?: number
  height?: number
}

export function StaffNotation({ note, notes, width, height }: StaffNotationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 200 })

  // Support both single note and multiple notes
  const displayNotes = notes || (note ? [note] : [])

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      // Calculate responsive dimensions
      const calcWidth = width || Math.min(containerWidth - 20, 500)
      const calcHeight = height || Math.max(150, Math.min(calcWidth * 0.4, 200))

      setDimensions({ width: calcWidth, height: calcHeight })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [width, height])

  useEffect(() => {
    if (!containerRef.current || displayNotes.length === 0) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Create VexFlow renderer
    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    )

    renderer.resize(dimensions.width, dimensions.height)
    const context = renderer.getContext()

    // Create a stave
    const stave = new Stave(10, 40, dimensions.width - 20)

    // Add clef (use clef from first note)
    stave.addClef(displayNotes[0].clef)

    // Draw the stave
    stave.setContext(context).draw()

    // Create the notes
    if (displayNotes.length === 1) {
      // Single note - whole note
      const vexNote = new StaveNote({
        keys: [noteToVexFlowKey(displayNotes[0])],
        duration: 'w',
        clef: displayNotes[0].clef,
      })
      Formatter.FormatAndDraw(context, stave, [vexNote])
    } else {
      // Multiple notes - quarter notes
      const vexNotes = displayNotes.map((n) =>
        new StaveNote({
          keys: [noteToVexFlowKey(n)],
          duration: 'q',
          clef: n.clef,
        })
      )
      Formatter.FormatAndDraw(context, stave, vexNotes)
    }
  }, [displayNotes, dimensions])

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center bg-white rounded-lg border w-full"
    />
  )
}
