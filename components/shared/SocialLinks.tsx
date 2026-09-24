import { SOCIAL_LINKS } from "@/lib/site";

const ICONS: Record<(typeof SOCIAL_LINKS)[number]["label"], React.ReactNode> = {
    Facebook: <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z" fill="currentColor" />,
    Instagram: (
        <g fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </g>
    ),
    Twitter: <path d="M4 4h4.6l4 5.6L17.4 4H20l-6.2 7.2L20.5 20h-4.6l-4.4-6-5.2 6H3.7l6.6-7.6z" fill="currentColor" />,
    TikTok: <path d="M16 3c.3 2.4 1.9 4 4.2 4.2v3.3c-1.5 0-2.9-.4-4.2-1.2V15a6 6 0 1 1-6-6h.6v3.4a2.7 2.7 0 1 0 2.1 2.6V3z" fill="currentColor" />,
    YouTube: <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15.2V8.8l5.2 3.2z" fill="currentColor" />,
    Snapchat: (
        <path
            d="M12 3c2.9 0 5 2.2 5 5v2.3l1.6-.5c.5 0 .9.4.7.9-.3.6-1.6 1-2.1 1.3.6 1.6 1.8 2.9 3.4 3.4.4.1.5.6.1.8-.8.4-1.8.5-2.3.7l-.3 1.1c-.9 0-1.9-.3-3 .2-.9.4-1.7 1.3-3.1 1.3s-2.2-.9-3.1-1.3c-1.1-.5-2.1-.2-3-.2l-.3-1.1c-.5-.2-1.5-.3-2.3-.7-.4-.2-.3-.7.1-.8 1.6-.5 2.8-1.8 3.4-3.4-.5-.3-1.8-.7-2.1-1.3-.2-.5.2-.9.7-.9l1.6.5V8c0-2.8 2.1-5 5-5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
        />
    ),
};

export default function SocialLinks({ className = "" }: { className?: string }) {
    return (
        <ul className={`social-links ${className}`}>
            {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="social-link">
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">{ICONS[s.label]}</svg>
                    </a>
                </li>
            ))}
        </ul>
    );
}
