export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="resume-page-wrapper fixed inset-0 z-50 overflow-auto bg-zinc-200 dark:bg-zinc-900">
      {children}
    </div>
  )
}
