'use client'

import { useState } from 'react'
import { useAdminSection } from '@/hooks/useAdminSection'
import type { Project } from '@/lib/types'
import { SortableList } from '@/components/admin/SortableList'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ProjectForm, type ProjectSubmitData } from '@/components/admin/forms/ProjectForm'
import { Plus } from 'lucide-react'

export default function AdminProjectsPage() {
  const { query, createMutation, updateMutation, deleteMutation, reorderMutation } =
    useAdminSection<Project>({ queryKey: 'projects', apiPath: '/api/projects' })

  const [modal, setModal] = useState<{ open: boolean; item?: Project }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const handleSubmit = (data: ProjectSubmitData) => {
    if (modal.item) {
      updateMutation.mutate({ id: modal.item.id, ...data } as Partial<Project> & { id: string }, {
        onSuccess: () => setModal({ open: false }),
      })
    } else {
      createMutation.mutate(data as Partial<Project>, {
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
        <h1 className="text-2xl font-bold text-foreground">프로젝트 관리</h1>
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
        <p className="text-sm text-muted">등록된 프로젝트가 없습니다.</p>
      )}

      {query.data && query.data.length > 0 && (
        <SortableList
          items={query.data}
          onReorder={(items) => reorderMutation.mutate(items)}
          renderItem={(item) => (
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.tags.length > 0 && (
                <p className="text-xs text-muted">{item.tags.join(', ')}</p>
              )}
            </div>
          )}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <FormModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.item ? '프로젝트 수정' : '프로젝트 추가'}
      >
        <ProjectForm
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
