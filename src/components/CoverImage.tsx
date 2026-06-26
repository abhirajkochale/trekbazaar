/**
 * Renders a trek cover image, or a styled gradient placeholder when no
 * cover_image_url is set. Uses a plain <img> so any image host works
 * without configuring next/image remotePatterns (fine for the MVP).
 */
export function CoverImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-sky-600 ${className}`}
      aria-label={`${alt} (no image available)`}
      role="img"
    >
      <span className="text-4xl" aria-hidden="true">
        🏔️
      </span>
    </div>
  );
}
