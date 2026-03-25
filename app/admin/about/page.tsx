'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { About } from '@/lib/types'
import { AboutForm, type AboutFormData } from '@/components/admin/forms/AboutForm'

export default function AdminAboutPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => apiFetch<About | null>('/api/about'),
  })

  const mutation = useMutation({
    mutationFn: (formData: AboutFormData) => {
      if (data?.id) {
        return apiFetch(`/api/about?id=${data.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        })
      }
      return apiFetch('/api/about', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['about'] }),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">소개 관리</h1>

      {isLoading ? (
        <p className="text-sm text-muted">로딩 중...</p>
      ) : (
        <div className="max-w-lg rounded-xl border border-border bg-background p-6">
          <AboutForm
            defaultValues={data ?? undefined}
            onSubmit={(formData) => mutation.mutate(formData)}
            isPending={mutation.isPending}
          />
          {mutation.isSuccess && (
            <p className="mt-3 text-sm text-green-600">저장되었습니다.</p>
          )}
          {mutation.isError && (
            <p className="mt-3 text-sm text-red-500">저장에 실패했습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}
