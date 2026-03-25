'use client'

import { useForm } from 'react-hook-form'

export interface AboutFormData {
  name: string
  title: string
  bio: string
  imageUrl: string
  resumeUrl: string
}

interface AboutFormProps {
  defaultValues?: Partial<{ [K in keyof AboutFormData]: AboutFormData[K] | null }>
  onSubmit: (data: AboutFormData) => void
  isPending: boolean
}

export function AboutForm({ defaultValues, onSubmit, isPending }: AboutFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AboutFormData>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      title: defaultValues?.title ?? '',
      bio: defaultValues?.bio ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      resumeUrl: defaultValues?.resumeUrl ?? '',
    },
  })

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

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">프로필 이미지 URL</label>
        <input
          {...register('imageUrl')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
