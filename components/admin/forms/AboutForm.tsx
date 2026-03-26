'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { FocalPointPicker } from '@/components/admin/FocalPointPicker'
import { X } from 'lucide-react'

export interface AboutFormData {
  name: string
  title: string
  bio: string
  imageUrl: string
  images: string[]
  imagePositions: Record<string, { x: number; y: number }>
  resumeUrl: string
}

interface AboutFormProps {
  defaultValues?: Partial<{ [K in keyof AboutFormData]: AboutFormData[K] | null }>
  onSubmit: (data: AboutFormData) => void
  isPending: boolean
}

export function AboutForm({ defaultValues, onSubmit, isPending }: AboutFormProps) {
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? [])
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    (defaultValues?.imagePositions as Record<string, { x: number; y: number }>) ?? {},
  )
  const [newImageUrl, setNewImageUrl] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AboutFormData>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      title: defaultValues?.title ?? '',
      bio: defaultValues?.bio ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      images: defaultValues?.images ?? [],
      imagePositions: (defaultValues?.imagePositions as Record<string, { x: number; y: number }>) ?? {},
      resumeUrl: defaultValues?.resumeUrl ?? '',
    },
  })

  const handleAddImage = (url: string) => {
    if (!url) return
    const updated = [...images, url]
    setImages(updated)
    setValue('images', updated)
    // Set default center position for new image
    const newPositions = { ...positions, [String(updated.length - 1)]: { x: 50, y: 50 } }
    setPositions(newPositions)
    setValue('imagePositions', newPositions)
    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    setValue('images', updated)
    // Reindex positions
    const newPositions: Record<string, { x: number; y: number }> = {}
    updated.forEach((_, i) => {
      const oldIndex = i >= index ? i + 1 : i
      newPositions[String(i)] = positions[String(oldIndex)] ?? { x: 50, y: 50 }
    })
    setPositions(newPositions)
    setValue('imagePositions', newPositions)
  }

  const handlePositionChange = (index: number, x: number, y: number) => {
    const newPositions = { ...positions, [String(index)]: { x, y } }
    setPositions(newPositions)
    setValue('imagePositions', newPositions)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">이름 *</label>
        <input
          {...register('name', { required: '이름을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="홍길동"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">직함 *</label>
        <input
          {...register('title', { required: '직함을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="프론트엔드 개발자"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">소개 *</label>
        <textarea
          {...register('bio', { required: '소개를 입력하세요' })}
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="간단한 자기소개를 작성하세요"
        />
        {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
      </div>

      {/* 슬라이더 이미지 목록 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          슬라이더 이미지 ({images.length}장)
        </label>
        {images.length > 0 && (
          <div className="mb-2 space-y-3">
            {images.map((url, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted">이미지 {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                  >
                    <X size={12} />
                    삭제
                  </button>
                </div>
                <FocalPointPicker
                  src={url}
                  x={positions[String(i)]?.x ?? 50}
                  y={positions[String(i)]?.y ?? 50}
                  onChange={(x, y) => handlePositionChange(i, x, y)}
                />
              </div>
            ))}
          </div>
        )}
        <ImageUpload
          value={newImageUrl}
          onChange={handleAddImage}
          label="이미지 추가"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">이력서 URL</label>
        <input
          {...register('resumeUrl')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="https://example.com/resume.pdf"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-foreground py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
