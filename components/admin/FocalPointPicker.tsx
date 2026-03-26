'use client'

import { useRef, useCallback } from 'react'

interface FocalPointPickerProps {
  src: string
  x: number
  y: number
  onChange: (x: number, y: number) => void
}

export function FocalPointPicker({ src, x, y, onChange }: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const nx = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)))
      const ny = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)))
      onChange(nx, ny)
    },
    [onChange],
  )

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updatePosition(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    updatePosition(e.clientX, e.clientY)
  }

  const handlePointerUp = () => {
    dragging.current = false
  }

  return (
    <div className="flex items-start gap-3">
      {/* Full image with crosshair */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-32 h-32 cursor-crosshair overflow-hidden rounded-lg border border-border select-none touch-none"
      >
        <img src={src} alt="위치 조정" className="w-full h-full object-cover" draggable={false} />
        {/* Crosshair indicator */}
        <div
          className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.3)]" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.3)]" />
        </div>
      </div>

      {/* Circle preview */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-muted">미리보기</p>
        <div className="w-16 h-16 rounded-full overflow-hidden border border-border">
          <img
            src={src}
            alt="미리보기"
            className="w-full h-full object-cover"
            style={{ objectPosition: `${x}% ${y}%` }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
