'use client'

import { useState } from 'react'
import { useAdminSection } from '@/hooks/useAdminSection'
import type { Contact } from '@/lib/types'
import { SortableList } from '@/components/admin/SortableList'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ContactForm, type ContactFormData } from '@/components/admin/forms/ContactForm'
import { Plus } from 'lucide-react'

export default function AdminContactPage() {
  const { query, createMutation, updateMutation, deleteMutation, reorderMutation } =
    useAdminSection<Contact>({ queryKey: 'contact', apiPath: '/api/contact' })

  const [modal, setModal] = useState<{ open: boolean; item?: Contact }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)

  const handleSubmit = (data: ContactFormData) => {
    if (modal.item) {
      updateMutation.mutate({ id: modal.item.id, ...data } as Partial<Contact> & { id: string }, {
        onSuccess: () => setModal({ open: false }),
      })
    } else {
      createMutation.mutate(data as unknown as Partial<Contact>, {
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
        <h1 className="text-2xl font-bold text-foreground">연락처 관리</h1>
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
        <p className="text-sm text-muted">등록된 연락처가 없습니다.</p>
      )}

      {query.data && query.data.length > 0 && (
        <SortableList
          items={query.data}
          onReorder={(items) => reorderMutation.mutate(items)}
          renderItem={(item) => (
            <div>
              <p className="text-sm font-medium text-foreground">
                <span className="mr-2 inline-block rounded bg-foreground/5 px-1.5 py-0.5 text-xs text-muted">
                  {item.type}
                </span>
                {item.label}
              </p>
              <p className="text-xs text-muted">{item.value}</p>
            </div>
          )}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <FormModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.item ? '연락처 수정' : '연락처 추가'}
      >
        <ContactForm
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
