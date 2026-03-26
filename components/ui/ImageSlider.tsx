'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageSliderProps {
  images: string[]
  positions?: Record<string, { x: number; y: number }> | null
  alt?: string
}

export function ImageSlider({ images, positions, alt = 'Profile' }: ImageSliderProps) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))
  const multi = images.length > 1

  const pos = positions?.[String(current)]
  const objectPosition = pos ? `${pos.x}% ${pos.y}%` : '50% 50%'

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-48 h-48 rounded-full overflow-hidden">
        <img
          src={images[current]}
          alt={`${alt} ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ objectPosition }}
        />
        {multi && (
          <>
            <button
              onClick={prev}
              className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1 text-foreground hover:bg-background transition-colors"
              aria-label="이전 이미지"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1 text-foreground hover:bg-background transition-colors"
              aria-label="다음 이미지"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
      {multi && (
        <div className="flex gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-foreground' : 'bg-muted/40'
              }`}
              aria-label={`이미지 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
