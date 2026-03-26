'use client'

import { useState, useRef } from 'react'
import { upload } from '@vercel/blob/client'
import { Upload, X, Link, ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  label = '이미지',
  placeholder = 'https://example.com/image.jpg',
}: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      onChange(blob.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드에 실패했습니다')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleClear = () => {
    onChange('')
    setError(null)
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20'

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>

      {/* 모드 전환 탭 */}
      <div className="mb-2 flex gap-1 rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-foreground text-background'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Upload size={14} />
          파일 업로드
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === 'url'
              ? 'bg-foreground text-background'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Link size={14} />
          URL 입력
        </button>
      </div>

      {/* 파일 업로드 모드 */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-sm transition-colors hover:border-foreground/40 disabled:opacity-50 ${
              isUploading ? 'cursor-wait' : 'cursor-pointer'
            }`}
          >
            {isUploading ? (
              <span className="text-muted">업로드 중...</span>
            ) : (
              <>
                <ImageIcon size={18} className="text-muted" />
                <span className="text-muted">클릭하여 파일 선택</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* URL 입력 모드 */}
      {mode === 'url' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
      )}

      {/* 에러 메시지 */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* 미리보기 */}
      {value && (
        <div className="mt-2 flex items-start gap-2">
          <img
            src={value}
            alt="미리보기"
            className="h-16 w-16 rounded-lg border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted">{value}</p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <X size={12} />
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
