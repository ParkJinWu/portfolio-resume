'use client'

import { useState } from 'react'
import { useAdminSection } from '@/hooks/useAdminSection'
import type { Education } from '@/lib/types'
import { SortableList } from '@/components/admin/SortableList'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { EducationForm, type EducationFormData } from '@/components/admin/forms/EducationForm'
import { Plus } from 'lucide-react'

export default function AdminEducationPage() {
  const { query, createMutation, updateMutation, deleteMutation, reorderMutation } =
    useAdminSection<Education>({ queryKey: 'education', apiPath: '/api/education' })

  const [modal, setModal] = useState<{ open: boolean; item?: Education }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null)

  const handleSubmit = (data: EducationFormData) => {
    if (modal.item) {
      updateMutation.mutate({ id: modal.item.id, ...data } as Partial<Education> & { id: string }, {
        onSuccess: () => setModal({ open: false }),
      })
    } else {
      createMutation.mutate(data as unknown as Partial<Education>, {
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
        <h1 className="text-2xl font-bold text-foreground">학력 관리</h1>
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
        <p className="text-sm text-muted">등록된 학력이 없습니다.</p>
      )}

      {query.data && query.data.length > 0 && (
        <SortableList
          items={query.data}
          onReorder={(items) => reorderMutation.mutate(items)}
          renderItem={(item) => (
            <div>
              <p className="text-sm font-medium text-foreground">
                {item.institution} — {item.degree}
              </p>
              <p className="text-xs text-muted">
                {item.startDate} ~ {item.endDate || '재학 중'}
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
        title={modal.item ? '학력 수정' : '학력 추가'}
      >
        <EducationForm
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
