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
  roles: string[]
  rolesPosition: string
  rolesInterval: number
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
  const [roles, setRoles] = useState<string[]>(defaultValues?.roles ?? [])
  const [newRole, setNewRole] = useState('')
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
      roles: defaultValues?.roles ?? [],
      rolesPosition: defaultValues?.rolesPosition ?? 'before',
      rolesInterval: defaultValues?.rolesInterval ?? 3,
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
        <label className="mb-1 block text-sm font-medium text-foreground">
          역할 로테이션 ({roles.length}개)
        </label>
        <p className="mb-2 text-xs text-muted">히어로 섹션에서 순환 표시될 역할/직함</p>
        {roles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {roles.map((role, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-muted/20 px-3 py-1 text-sm text-foreground"
              >
                {role}
                <button
                  type="button"
                  onClick={() => {
                    const updated = roles.filter((_, idx) => idx !== i)
                    setRoles(updated)
                    setValue('roles', updated)
                  }}
                  className="ml-1 text-muted hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (newRole.trim()) {
                  const updated = [...roles, newRole.trim()]
                  setRoles(updated)
                  setValue('roles', updated)
                  setNewRole('')
                }
              }
            }}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="Frontend Developer"
          />
          <button
            type="button"
            onClick={() => {
              if (newRole.trim()) {
                const updated = [...roles, newRole.trim()]
                setRoles(updated)
                setValue('roles', updated)
                setNewRole('')
              }
            }}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/10"
          >
            추가
          </button>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-muted">로테이션 위치</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue('rolesPosition', 'before')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                watch('rolesPosition') === 'before'
                  ? 'bg-foreground text-background'
                  : 'border border-border text-foreground hover:bg-muted/10'
              }`}
            >
              앞 (로테이션 + 고정)
            </button>
            <button
              type="button"
              onClick={() => setValue('rolesPosition', 'after')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                watch('rolesPosition') === 'after'
                  ? 'bg-foreground text-background'
                  : 'border border-border text-foreground hover:bg-muted/10'
              }`}
            >
              뒤 (고정 + 로테이션)
            </button>
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-muted">로테이션 간격 (초)</label>
          <input
            type="number"
            min={1}
            max={10}
            {...register('rolesInterval', { valueAsNumber: true, min: 1, max: 10 })}
            className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
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
