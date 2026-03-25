'use client'

import { useState } from 'react'
import { useAdminSection } from '@/hooks/useAdminSection'
import type { Experience } from '@/lib/types'
import { SortableList } from '@/components/admin/SortableList'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ExperienceForm, type ExperienceFormData } from '@/components/admin/forms/ExperienceForm'
import { Plus } from 'lucide-react'

export default function AdminExperiencePage() {
  const { query, createMutation, updateMutation, deleteMutation, reorderMutation } =
    useAdminSection<Experience>({ queryKey: 'experience', apiPath: '/api/experience' })

  const [modal, setModal] = useState<{ open: boolean; item?: Experience }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null)

  const handleSubmit = (data: ExperienceFormData) => {
    if (modal.item) {
      updateMutation.mutate({ id: modal.item.id, ...data } as Partial<Experience> & { id: string }, {
        onSuccess: () => setModal({ open: false }),
      })
    } else {
      createMutation.mutate(data as unknown as Partial<Experience>, {
        onSuccess: () => setModal({ open: false }),
      })
    }
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">경력 관리</h1>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          <Plus size={16} />
          추가
        </button>
      </div>

      {query.isLoading && <p className="text-sm text-muted">로딩 중...</p>}

      {query.data && query.data.length === 0 && (
        <p className="text-sm text-muted">등록된 경력이 없습니다.</p>
      )}

      {query.data && query.data.length > 0 && (
        <SortableList
          items={query.data}
          onReorder={(items) => reorderMutation.mutate(items)}
          renderItem={(item) => (
            <div>
              <p className="text-sm font-medium text-foreground">
                {item.company} — {item.position}
              </p>
              <p className="text-xs text-muted">
                {item.startDate} ~ {item.endDate || '현재'}
              </p>
            </div>
          )}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <FormModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.item ? '경력 수정' : '경력 추가'}
      >
        <ExperienceForm
          key={modal.item?.id ?? 'new'}
          defaultValues={modal.item}
          onSubmit={handleSubmit}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
