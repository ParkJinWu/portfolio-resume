'use client'

import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageSliderProps {
  images: string[]
  positions?: Record<string, { x: number; y: number }> | null
  alt?: string
}

export function ImageSlider({ images, positions, alt = 'Profile' }: ImageSliderProps) {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)),
    [images.length],
  )
  const next = useCallback(
    () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)),
    [images.length],
  )

  if (images.length === 0) return null

  const multi = images.length > 1
  const total = images.length

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D Carousel */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center [perspective:1000px]">
          {images.map((src, index) => {
            const offset = index - current
            let pos = ((offset % total) + total) % total
            if (pos > Math.floor(total / 2)) pos -= total

            const isCenter = pos === 0
            const isAdjacent = Math.abs(pos) === 1

            const imgPos = positions?.[String(index)]
            const objectPosition = imgPos
              ? `${imgPos.x}% ${imgPos.y}%`
              : '50% 50%'

            return (
              <div
                key={index}
                className="absolute w-64 h-64 transition-all duration-500 ease-in-out flex items-center justify-center"
                style={{
                  transform: `translateX(${pos * 45}%) scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7}) rotateY(${pos * -10}deg)`,
                  zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                  opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                  filter: isCenter ? 'blur(0px)' : 'blur(4px)',
                  visibility: Math.abs(pos) > 1 ? 'hidden' : 'visible',
                }}
              >
                <img
                  src={src}
                  alt={`${alt} ${index + 1}`}
                  className="object-cover w-full h-full rounded-full border-2 border-foreground/10 shadow-2xl"
                  style={{ objectPosition }}
                />
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        {multi && (
          <>
            <button
              onClick={prev}
              className="absolute left-[-1rem] top-1/2 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm border border-border p-1.5 text-foreground hover:bg-background transition-colors z-20"
              aria-label="이전 이미지"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-[-1rem] top-1/2 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm border border-border p-1.5 text-foreground hover:bg-background transition-colors z-20"
              aria-label="다음 이미지"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
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
