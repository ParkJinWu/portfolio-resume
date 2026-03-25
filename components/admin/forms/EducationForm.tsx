'use client'

import { useForm } from 'react-hook-form'

export interface EducationFormData {
  institution: string
  degree: string
  startDate: string
  endDate: string
  description: string
}

interface EducationFormProps {
  defaultValues?: Partial<{ [K in keyof EducationFormData]: EducationFormData[K] | null }>
  onSubmit: (data: EducationFormData) => void
  isPending: boolean
}

export function EducationForm({ defaultValues, onSubmit, isPending }: EducationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EducationFormData>({
    defaultValues: {
      institution: defaultValues?.institution ?? '',
      degree: defaultValues?.degree ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      description: defaultValues?.description ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">학교/기관명 *</label>
        <input
          {...register('institution', { required: '학교/기관명을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="서울대학교"
        />
        {errors.institution && <p className="mt-1 text-xs text-red-500">{errors.institution.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">학위/전공 *</label>
        <input
          {...register('degree', { required: '학위/전공을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="컴퓨터공학 학사"
        />
        {errors.degree && <p className="mt-1 text-xs text-red-500">{errors.degree.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">시작일 *</label>
          <input
            {...register('startDate', { required: '시작일을 입력하세요' })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="2020.03"
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">종료일</label>
          <input
            {...register('endDate')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="재학 중이면 비워두세요"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">설명</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="추가 설명 (선택)"
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
