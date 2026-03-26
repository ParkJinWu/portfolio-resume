'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { X } from 'lucide-react'

export interface AboutFormData {
  name: string
  title: string
  bio: string
  imageUrl: string
  images: string[]
  resumeUrl: string
}

interface AboutFormProps {
  defaultValues?: Partial<{ [K in keyof AboutFormData]: AboutFormData[K] | null }>
  onSubmit: (data: AboutFormData) => void
  isPending: boolean
}

export function AboutForm({ defaultValues, onSubmit, isPending }: AboutFormProps) {
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? [])
  const [newImageUrl, setNewImageUrl] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AboutFormData>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      title: defaultValues?.title ?? '',
      bio: defaultValues?.bio ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      images: defaultValues?.images ?? [],
      resumeUrl: defaultValues?.resumeUrl ?? '',
    },
  })

  const handleAddImage = (url: string) => {
    if (!url) return
    const updated = [...images, url]
    setImages(updated)
    setValue('images', updated)
    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    setValue('images', updated)
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

      <ImageUpload
        value={watch('imageUrl')}
        onChange={(url) => setValue('imageUrl', url)}
        label="대표 프로필 이미지"
        placeholder="https://example.com/photo.jpg"
      />

      {/* 슬라이더 이미지 목록 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          슬라이더 이미지 ({images.length}장)
        </label>
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt={`슬라이더 ${i + 1}`}
                  className="h-16 w-16 rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                >
                  <X size={12} />
                </button>
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
