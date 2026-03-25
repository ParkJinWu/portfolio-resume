'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

interface UseAdminSectionOptions {
  queryKey: string
  apiPath: string
}

export function useAdminSection<T extends { id: string }>({
  queryKey,
  apiPath,
}: UseAdminSectionOptions) {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: [queryKey] })

  const query = useQuery<T[]>({
    queryKey: [queryKey],
    queryFn: () => apiFetch<T[]>(apiPath),
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) =>
      apiFetch<T>(apiPath, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<T> & { id: string }) =>
      apiFetch<T>(`${apiPath}?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<null>(`${apiPath}?id=${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  const reorderMutation = useMutation({
    mutationFn: (items: T[]) =>
      Promise.all(
        items.map((item, index) =>
          apiFetch<T>(`${apiPath}?id=${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({ order: index }),
          }),
        ),
      ),
    onSuccess: invalidate,
  })

  return { query, createMutation, updateMutation, deleteMutation, reorderMutation }
}
