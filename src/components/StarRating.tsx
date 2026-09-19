export default function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount?: number;
}) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <svg viewBox="0 0 20 20" fill="#f59e0b" className="h-4 w-4">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5z" />
      </svg>
      <span className="font-semibold text-slate-700">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && (
        <span className="text-slate-400">({reviewCount} ulasan)</span>
      )}
    </div>
  );
}
