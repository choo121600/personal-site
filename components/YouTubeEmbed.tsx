'use client'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

export function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
}: YouTubeEmbedProps) {
  return (
    <div className="relative my-6 aspect-video w-full overflow-hidden rounded-xl">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
