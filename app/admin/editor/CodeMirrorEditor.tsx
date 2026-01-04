'use client'

import { useEffect, useState } from 'react'

interface CodeMirrorEditorProps {
  value: string
  onChange: (value: string) => void
  onPaste?: (e: React.ClipboardEvent) => void
}

export default function CodeMirrorEditorComponent({
  value,
  onChange,
  onPaste,
}: CodeMirrorEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [extensions, setExtensions] = useState<{ CodeMirror: any; markdown: any } | null>(null)
  const [theme, setTheme] = useState<any>(null)

  useEffect(() => {
    // 클라이언트에서만 확장 로드
    setIsMounted(true)
    
    // 확장을 비동기로 로드
    Promise.all([
      import('@uiw/react-codemirror').then((mod) => mod.default),
      import('@codemirror/lang-markdown').then((mod) => mod.markdown),
      import('@codemirror/theme-one-dark').then((mod) => mod.oneDark),
    ]).then(([CodeMirrorComponent, mdExt, darkTheme]) => {
      setExtensions({ CodeMirror: CodeMirrorComponent, markdown: mdExt })
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

  const { CodeMirror, markdown: markdownExt } = extensions

  return (
    <div onPaste={onPaste} className="h-full overflow-hidden">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[markdownExt()]}
        theme={theme}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
        }}
        className="h-full"
      />
    </div>
  )
}

