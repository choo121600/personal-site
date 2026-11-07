'use client'

import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import type { Extension } from '@codemirror/state'

interface CodeMirrorEditorProps {
  value: string
  onChange: (value: string) => void
}

export interface CodeMirrorEditorHandle {
  insertImage: (file: File) => Promise<void>
}

// 이미지를 올리고 본문에 넣을 마크다운을 돌려준다
async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await fetch('/admin/api/images', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      alert('이미지 업로드에 실패했습니다.')
      return null
    }
    const data = await response.json()
    return `![${file.name}](${data.path})`
  } catch (error) {
    console.error('Image upload error:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
    return null
  }
}

const CodeMirrorEditorComponent = forwardRef<
  CodeMirrorEditorHandle,
  CodeMirrorEditorProps
>(function CodeMirrorEditorComponent({ value, onChange }, ref) {
  const [isMounted, setIsMounted] = useState(false)
  const [extensions, setExtensions] = useState<{
    CodeMirror: typeof import('@uiw/react-codemirror').default
    markdown: typeof import('@codemirror/lang-markdown').markdown
    lineWrapping: Extension
  } | null>(null)
  const [theme, setTheme] = useState<Extension | null>(null)
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  const insertAtCursor = (text: string) => {
    const view = editorRef.current?.view
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
    })
  }

  const insertImage = async (file: File) => {
    const markdown = await uploadImage(file)
    if (markdown) insertAtCursor(`\n${markdown}\n`)
  }

  const insertImages = async (files: File[]) => {
    for (const file of files) await insertImage(file)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const images = Array.from(e.clipboardData.files).filter((file) =>
      file.type.startsWith('image/'),
    )
    if (images.length === 0) return
    e.preventDefault()
    insertImages(images)
  }

  const handleDrop = (e: React.DragEvent) => {
    const images = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    )
    if (images.length === 0) return
    e.preventDefault()
    insertImages(images)
  }

  useImperativeHandle(ref, () => ({ insertImage }))

  useEffect(() => {
    // 클라이언트에서만 확장 로드
    setIsMounted(true)

    // 확장을 비동기로 로드
    Promise.all([
      import('@uiw/react-codemirror').then((mod) => mod.default),
      import('@codemirror/lang-markdown').then((mod) => mod.markdown),
      import('@codemirror/theme-one-dark').then((mod) => mod.oneDark),
      import('@codemirror/view').then((mod) => mod.EditorView.lineWrapping),
    ]).then(([CodeMirrorComponent, mdExt, darkTheme, lineWrap]) => {
      setExtensions({
        CodeMirror: CodeMirrorComponent,
        markdown: mdExt,
        lineWrapping: lineWrap,
      })
      setTheme(darkTheme)
    })
  }, [])

  if (!isMounted || !extensions || !theme) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-zinc-500">에디터 로딩 중...</div>
      </div>
    )
  }

  const { CodeMirror, markdown: markdownExt, lineWrapping } = extensions

  return (
    <div
      onPasteCapture={handlePaste}
      onDropCapture={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="h-full overflow-auto"
    >
      <CodeMirror
        ref={editorRef}
        value={value}
        onChange={onChange}
        extensions={[markdownExt(), lineWrapping]}
        theme={theme}
        height="100%"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
        }}
        className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
      />
    </div>
  )
})

export default CodeMirrorEditorComponent
