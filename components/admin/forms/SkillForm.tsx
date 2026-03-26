'use client'

import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/admin/ImageUpload'

export interface SkillFormData {
  name: string
  category: string
  iconUrl: string
}

interface SkillFormProps {
  defaultValues?: Partial<{ [K in keyof SkillFormData]: SkillFormData[K] | null }>
  onSubmit: (data: SkillFormData) => void
  isPending: boolean
}

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Tool', 'Database', 'Language']

export function SkillForm({ defaultValues, onSubmit, isPending }: SkillFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SkillFormData>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? '',
      iconUrl: defaultValues?.iconUrl ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">기술명 *</label>
        <input
          {...register('name', { required: '기술명을 입력하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
          placeholder="React"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">카테고리 *</label>
        <select
          {...register('category', { required: '카테고리를 선택하세요' })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="">선택하세요</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <ImageUpload
        value={watch('iconUrl')}
        onChange={(url) => setValue('iconUrl', url)}
        label="아이콘"
        placeholder="https://example.com/icon.svg"
      />

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
