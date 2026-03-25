'use client'

import { useForm } from 'react-hook-form'

export interface ExperienceFormData {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface ExperienceFormProps {
  defaultValues?: Partial<{ [K in keyof ExperienceFormData]: ExperienceFormData[K] | null }>
  onSubmit: (data: ExperienceFormData) => void
  isPending: boolean
}

export function ExperienceForm({ defaultValues, onSubmit, isPending }: ExperienceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ExperienceFormData>({
    defaultValues: {
      company: defaultValues?.company ?? '',
      position: defaultValues?.position ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      description: defaultValues?.description ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">회사명 *</label>
        <input
          {...register('company', { required: '회사명을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="회사명"
        />
        {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">직책 *</label>
        <input
          {...register('position', { required: '직책을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="프론트엔드 개발자"
        />
        {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">시작일 *</label>
          <input
            {...register('startDate', { required: '시작일을 입력하세요' })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="2024.01"
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">종료일</label>
          <input
            {...register('endDate')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="현재 재직 중이면 비워두세요"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">설명 *</label>
        <textarea
          {...register('description', { required: '설명을 입력하세요' })}
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="업무 내용을 작성하세요"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
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
