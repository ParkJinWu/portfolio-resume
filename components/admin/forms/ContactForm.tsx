'use client'

import { useForm } from 'react-hook-form'

export interface ContactFormData {
  type: string
  label: string
  value: string
}

interface ContactFormProps {
  defaultValues?: Partial<ContactFormData>
  onSubmit: (data: ContactFormData) => void
  isPending: boolean
}

const CONTACT_TYPES = ['email', 'github', 'linkedin', 'blog', 'twitter', 'phone', 'website']

export function ContactForm({ defaultValues, onSubmit, isPending }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    defaultValues: {
      type: defaultValues?.type ?? '',
      label: defaultValues?.label ?? '',
      value: defaultValues?.value ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">유형 *</label>
        <select
          {...register('type', { required: '유형을 선택하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="">선택하세요</option>
          {CONTACT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">라벨 *</label>
        <input
          {...register('label', { required: '라벨을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="GitHub"
        />
        {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">값 *</label>
        <input
          {...register('value', { required: '값을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="https://github.com/username"
        />
        {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value.message}</p>}
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
