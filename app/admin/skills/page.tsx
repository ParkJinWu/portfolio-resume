'use client'

import { useState } from 'react'
import { useAdminSection } from '@/hooks/useAdminSection'
import type { Skill } from '@/lib/types'
import { SortableList } from '@/components/admin/SortableList'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { SkillForm, type SkillFormData } from '@/components/admin/forms/SkillForm'
import { Plus } from 'lucide-react'

export default function AdminSkillsPage() {
  const { query, createMutation, updateMutation, deleteMutation, reorderMutation } =
    useAdminSection<Skill>({ queryKey: 'skills', apiPath: '/api/skills' })

  const [modal, setModal] = useState<{ open: boolean; item?: Skill }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null)

  const handleSubmit = (data: SkillFormData) => {
    if (modal.item) {
      updateMutation.mutate({ id: modal.item.id, ...data } as Partial<Skill> & { id: string }, {
        onSuccess: () => setModal({ open: false }),
      })
    } else {
      createMutation.mutate(data as unknown as Partial<Skill>, {
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

  // 카테고리별 그룹핑
  const grouped = query.data?.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || '기타'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">기술 관리</h1>
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
        <p className="text-sm text-muted">등록된 기술이 없습니다.</p>
      )}

      {grouped && Object.entries(grouped).map(([category, skills]) => (
        <div key={category} className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-muted">{category}</h2>
          <SortableList
            items={skills}
            onReorder={(items) => {
              const otherItems = query.data!.filter((s) => s.category !== category)
              reorderMutation.mutate([...otherItems, ...items])
            }}
            renderItem={(item) => (
              <p className="text-sm font-medium text-foreground">{item.name}</p>
            )}
            onEdit={(item) => setModal({ open: true, item })}
            onDelete={(item) => setDeleteTarget(item)}
          />
        </div>
      ))}

      <FormModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.item ? '기술 수정' : '기술 추가'}
      >
        <SkillForm
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
