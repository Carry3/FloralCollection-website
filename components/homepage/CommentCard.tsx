"use client";

export interface CommentData {
    id: string;
    name: string;
    /** 头像地址；缺省时显示姓名首字母 */
    avatar?: string;
    rating: number; // 1 to 5
    text: string;
}

interface CommentCardProps {
    comment: CommentData;
    onClick: () => void;
}

export function StarRatings({ rating }: { rating: number }) {
    const stars = Array.from({ length: 5 }, (_, i) => i < rating);
    return (
        <div className="flex gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
            {stars.map((filled, i) => (
                <svg
                    key={i}
                    className="w-4 h-4"
                    style={{ color: filled ? "var(--accent)" : "var(--border-strong)" }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export function CommentAvatar({ comment, size }: { comment: CommentData; size: number }) {
    if (comment.avatar) {
        return (
            <img
                src={comment.avatar}
                alt={comment.name}
                className="rounded-full object-cover"
                style={{ width: size, height: size, border: "1px solid var(--border-subtle)" }}
                loading="lazy"
            />
        );
    }
    const initials = comment.name
        .split(/\s|&/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
    return (
        <span
            className="rounded-full flex items-center justify-center font-heading flex-shrink-0"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.4,
                background: "var(--palette-blush-linen)",
                color: "var(--text-primary)",
            }}
            aria-hidden="true"
        >
            {initials}
        </span>
    );
}

export default function CommentCard({ comment, onClick }: CommentCardProps) {
    return (
        <div
            className="flex-shrink-0 w-[320px] sm:w-[380px] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer mx-3 h-full"
            style={{
                backgroundColor: "var(--palette-porcelain-white)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-sm)",
            }}
            onClick={onClick}
        >
            <div className="flex items-center gap-4 pointer-events-none">
                <CommentAvatar comment={comment} size={48} />
                <div className="flex flex-col">
                    <h4 className="font-heading font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                        {comment.name}
                    </h4>
                    <StarRatings rating={comment.rating} />
                </div>
            </div>
            <p className="text-sm leading-relaxed font-body line-clamp-3 relative pointer-events-none" style={{ color: "var(--text-secondary)" }}>
                {comment.text}
            </p>
        </div>
    );
}
