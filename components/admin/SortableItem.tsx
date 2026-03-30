'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  actions?: React.ReactNode
}

export function SortableItem({ id, children, onEdit, onDelete, actions }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted hover:text-foreground"
      >
        <GripVertical size={18} />
      </button>

      <div className="min-w-0 flex-1">{children}</div>

      <div className="flex shrink-0 gap-1">
        {actions ?? (
          <>
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
