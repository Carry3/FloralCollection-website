"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faq";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
    // 默认展开第一题，与设计稿一致
    const [open, setOpen] = useState<number | null>(0);

    return (
        <ul className="faq-list">
            {items.map((item, i) => {
                const isOpen = open === i;
                return (
                    <li key={item.q} className={`faq-item${isOpen ? " is-open" : ""}`}>
                        <button
                            type="button"
                            className="faq-trigger"
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${i}`}
                            id={`faq-question-${i}`}
                            onClick={() => setOpen(isOpen ? null : i)}
                        >
                            <span className="faq-prefix" aria-hidden="true">Q:</span>
                            <span className="faq-question">{item.q}</span>
                            <span className="faq-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                        </button>
                        <div
                            className="faq-answer-wrap"
                            id={`faq-answer-${i}`}
                            role="region"
                            aria-labelledby={`faq-question-${i}`}
                            hidden={!isOpen}
                        >
                            <div className="faq-answer">
                                <span className="faq-prefix" aria-hidden="true">A:</span>
                                <div className="faq-answer-body">{item.a}</div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
