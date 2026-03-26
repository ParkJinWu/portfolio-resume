'use client'

import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface ProjectFormData {
  title: string
  description: string
  imageUrl: string
  siteUrl: string
  githubUrl: string
  tags: string
  startDate: string
  endDate: string
  achievements: string
}

export interface ProjectSubmitData {
  title: string
  description: string
  imageUrl: string
  siteUrl: string
  githubUrl: string
  tags: string[]
  startDate: string
  endDate: string
  achievements: string[]
}

interface ProjectFormProps {
  defaultValues?: Partial<{
    title: string
    description: string
    imageUrl: string | null
    siteUrl: string | null
    githubUrl: string | null
    tags: string | string[]
    startDate: string | null
    endDate: string | null
    achievements: string | string[]
  }>
  onSubmit: (data: ProjectSubmitData) => void
  isPending: boolean
}

export function ProjectForm({ defaultValues, onSubmit, isPending }: ProjectFormProps) {
  const tagsDefault = Array.isArray(defaultValues?.tags)
    ? defaultValues.tags.join(', ')
    : (defaultValues?.tags ?? '')

  const achievementsDefault = Array.isArray(defaultValues?.achievements)
    ? defaultValues.achievements.join('\n')
    : (defaultValues?.achievements ?? '')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      siteUrl: defaultValues?.siteUrl ?? '',
      githubUrl: defaultValues?.githubUrl ?? '',
      tags: tagsDefault,
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      achievements: achievementsDefault,
    },
  })

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit({
      ...data,
      tags: data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      achievements: data.achievements
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
    })
  }

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">프로젝트명 *</label>
        <input
          {...register('title', { required: '프로젝트명을 입력하세요' })}
          className={inputClass}
          placeholder="프로젝트명"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">시작일</label>
          <input
            {...register('startDate')}
            className={inputClass}
            placeholder="2026.03"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">종료일</label>
          <input
            {...register('endDate')}
            className={inputClass}
            placeholder="2026.03"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">설명 *</label>
        <textarea
          {...register('description', { required: '설명을 입력하세요' })}
          rows={4}
          className={`${inputClass} resize-y`}
          placeholder="프로젝트 설명을 작성하세요"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <ImageUpload
        value={watch('imageUrl')}
        onChange={(url) => setValue('imageUrl', url)}
        label="프로젝트 이미지"
        placeholder="https://example.com/image.jpg"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">사이트 URL</label>
          <input
            {...register('siteUrl')}
            className={inputClass}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">GitHub URL</label>
          <input
            {...register('githubUrl')}
            className={inputClass}
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">태그</label>
        <input
          {...register('tags')}
          className={inputClass}
          placeholder="React, TypeScript, Next.js (콤마로 구분)"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">주요 성과</label>
        <textarea
          {...register('achievements')}
          rows={4}
          className={`${inputClass} resize-y`}
          placeholder="줄바꿈으로 구분"
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
