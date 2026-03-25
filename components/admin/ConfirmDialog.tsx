'use client'

import { useEffect } from 'react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  isPending?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = '삭제 확인',
  description = '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
  isPending = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        role="alertdialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-lg"
      >
        <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>
        <p className="mb-6 text-sm text-muted">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}
