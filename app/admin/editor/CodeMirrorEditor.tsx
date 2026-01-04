'use client'

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror'

interface CodeMirrorEditorProps {
  value: string
  onChange: (value: string) => void
  onPaste?: (e: React.ClipboardEvent) => void
}

export interface CodeMirrorEditorHandle {
  insertAtCursor: (text: string) => void
}

const CodeMirrorEditorComponent = forwardRef<CodeMirrorEditorHandle, CodeMirrorEditorProps>(
  function CodeMirrorEditorComponent({ value, onChange, onPaste }, ref) {
    const [isMounted, setIsMounted] = useState(false)
    const [extensions, setExtensions] = useState<{ CodeMirror: any; markdown: any; lineWrapping: any } | null>(null)
    const [theme, setTheme] = useState<any>(null)
    const editorRef = useRef<ReactCodeMirrorRef>(null)

    // 커서 위치에 텍스트 삽입 함수 노출
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        const view = editorRef.current?.view
        if (view) {
          const { from, to } = view.state.selection.main
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: from + text.length },
          })
        }
      },
    }))

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
        setExtensions({ CodeMirror: CodeMirrorComponent, markdown: mdExt, lineWrapping: lineWrap })
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
      <div onPaste={onPaste} className="h-full overflow-auto">
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
  }
)

export default CodeMirrorEditorComponent

