'use client'

import { useForm } from 'react-hook-form'

interface ProjectFormData {
  title: string
  description: string
  imageUrl: string
  siteUrl: string
  githubUrl: string
  tags: string
}

export interface ProjectSubmitData {
  title: string
  description: string
  imageUrl: string
  siteUrl: string
  githubUrl: string
  tags: string[]
}

interface ProjectFormProps {
  defaultValues?: Partial<{ title: string; description: string; imageUrl: string | null; siteUrl: string | null; githubUrl: string | null; tags: string | string[] }>
  onSubmit: (data: ProjectSubmitData) => void
  isPending: boolean
}

export function ProjectForm({ defaultValues, onSubmit, isPending }: ProjectFormProps) {
  const tagsDefault = Array.isArray(defaultValues?.tags)
    ? defaultValues.tags.join(', ')
    : (defaultValues?.tags ?? '')

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      siteUrl: defaultValues?.siteUrl ?? '',
      githubUrl: defaultValues?.githubUrl ?? '',
      tags: tagsDefault,
    },
  })

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit({
      ...data,
      tags: data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">프로젝트명 *</label>
        <input
          {...register('title', { required: '프로젝트명을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="프로젝트명"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">설명 *</label>
        <textarea
          {...register('description', { required: '설명을 입력하세요' })}
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="프로젝트 설명을 작성하세요"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">이미지 URL</label>
        <input
          {...register('imageUrl')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">사이트 URL</label>
          <input
            {...register('siteUrl')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">GitHub URL</label>
          <input
            {...register('githubUrl')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">태그</label>
        <input
          {...register('tags')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="React, TypeScript, Next.js (콤마로 구분)"
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
