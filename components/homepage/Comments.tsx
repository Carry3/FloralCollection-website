"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CommentCard, { CommentAvatar, CommentData, StarRatings } from "./CommentCard";

interface CommentsProps {
  comments: CommentData[];
}

export default function Comments({ comments }: CommentsProps) {
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef      = useRef<HTMLElement>(null);
  const visibleRef      = useRef(false);   // marquee rAF only runs while on-screen
  const trackRef        = useRef<HTMLDivElement>(null);
  const offsetRef       = useRef(0);       // current translateX value
  const velRef          = useRef(0);       // momentum velocity
  const lastXRef        = useRef(0);
  const lastTimeRef     = useRef(0);
  const draggingRef     = useRef(false);
  const rafRef          = useRef<number>(0);
  const dragStartXRef   = useRef(0);
  const dragStartTimeRef = useRef(0);
  const halfWidthRef    = useRef(0);       // half of duplicated track width (one set)

  // Measure the natural width of one set of cards (half the track)
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [comments]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedComment ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedComment]);

  const applyTransform = (x: number) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(${x}px)`;
  };

  // Wrap offset so the track loops seamlessly
  const wrapOffset = (x: number) => {
    const w = halfWidthRef.current;
    if (w <= 0) return x;
    // keep in range (-w, 0]
    return ((x % w) - w) % w;
  };

  const tick = useCallback(() => {
    if (draggingRef.current) return;
    // Apply friction
    velRef.current *= 0.95;
    offsetRef.current = wrapOffset(offsetRef.current + velRef.current);
    applyTransform(offsetRef.current);

    if (Math.abs(velRef.current) > 0.1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Hand off to CSS auto-scroll
      velRef.current = 0;
      startAutoScroll();
    }
  }, []);

  const autoScrollRef = useRef<number>(0);
  const AUTO_SPEED = 0.6; // px per frame

  const startAutoScroll = useCallback(() => {
    cancelAnimationFrame(autoScrollRef.current);
    const loop = () => {
      if (draggingRef.current || !visibleRef.current) return;
      offsetRef.current = wrapOffset(offsetRef.current - AUTO_SPEED);
      applyTransform(offsetRef.current);
      autoScrollRef.current = requestAnimationFrame(loop);
    };
    autoScrollRef.current = requestAnimationFrame(loop);
  }, []);

  const stopAutoScroll = () => cancelAnimationFrame(autoScrollRef.current);

  // Run the marquee only while the section is on-screen — the rAF loop writes
  // a transform every frame, which is pure waste while the user is anywhere
  // else on the page.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        startAutoScroll();
      } else {
        stopAutoScroll();
        cancelAnimationFrame(rafRef.current);
      }
    });
    io.observe(section);
    return () => {
      io.disconnect();
      stopAutoScroll();
      cancelAnimationFrame(rafRef.current);
    };
  }, [startAutoScroll]);

  const beginDrag = (clientX: number) => {
    draggingRef.current = true;
    setIsDragging(true);
    stopAutoScroll();
    cancelAnimationFrame(rafRef.current);
    dragStartXRef.current = clientX;
    dragStartTimeRef.current = Date.now();
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velRef.current = 0;
  };

  const moveDrag = (clientX: number) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dt = now - lastTimeRef.current || 1;
    const dx = clientX - lastXRef.current;
    velRef.current = dx / dt * 16; // scale to ~60fps
    offsetRef.current = wrapOffset(offsetRef.current + dx);
    applyTransform(offsetRef.current);
    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const endDrag = (clientX: number) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);

    const totalMove = Math.abs(clientX - dragStartXRef.current);
    const elapsed   = Date.now() - dragStartTimeRef.current;

    if (totalMove < 5 && elapsed < 250) {
      // Treat as click — handled by card onClick
      startAutoScroll();
      return;
    }

    // Momentum scroll then hand off
    if (Math.abs(velRef.current) > 0.5) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      startAutoScroll();
    }
  };

  const handleCardClick = (comment: CommentData) => {
    const totalMove = Math.abs(lastXRef.current - dragStartXRef.current);
    if (totalMove < 5) setSelectedComment(comment);
  };

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden relative bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl font-heading font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          What Our Clients Say
        </h2>
        <p className="mt-4 text-lg font-body" style={{ color: "var(--text-secondary)" }}>
          Hear from the couples who trusted us with their big day.
        </p>
      </div>

      {/* Marquee Container */}
      <div
        className={`relative flex overflow-hidden w-full py-4 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        /* skip layout/paint of the ~2×N card track until the section nears the
           viewport; applied here (not the <section>) so the fixed-position
           modal below isn't caught by the paint containment */
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 340px" }}
        onMouseDown={(e) => beginDrag(e.clientX)}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={(e) => endDrag(e.clientX)}
        onMouseLeave={(e) => endDrag(e.clientX)}
        onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
        onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
        onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
      >
        {/* Edge fade overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #ffffff, transparent)" }} />
        <div className="absolute top-0 right-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #ffffff, transparent)" }} />

        {/* Track — transform driven by JS */}
        <div ref={trackRef} className="flex items-stretch w-max will-change-transform">
          {comments.map((comment) => (
            <div key={comment.id} className="h-full flex">
              <CommentCard comment={comment} onClick={() => handleCardClick(comment)} />
            </div>
          ))}
          {comments.map((comment) => (
            <div key={`${comment.id}-dup`} className="h-full flex">
              <CommentCard comment={comment} onClick={() => handleCardClick(comment)} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedComment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
          <div className="absolute inset-0 backdrop-blur-md" style={{ background: "rgba(74, 66, 56, 0.55)" }} onClick={() => setSelectedComment(null)} aria-hidden="true" />
          <div className="relative rounded-2xl shadow-2xl max-w-2xl w-full p-8 sm:p-12 z-10 transform scale-95 opacity-0 animate-[zoomIn_0.3s_ease-out_forwards]" style={{ background: "var(--palette-porcelain-white)", border: "1px solid var(--border-default)" }}>
            <button
              onClick={() => setSelectedComment(null)}
              className="absolute top-6 right-6 p-2 rounded-full transition-all cursor-pointer hover:opacity-70"
              style={{ background: "var(--palette-petal-mist)", color: "var(--text-secondary)" }}
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8" style={{ borderBottom: "1px solid var(--border-default)" }}>
              <CommentAvatar comment={selectedComment} size={80} />
              <div className="flex flex-col gap-2">
                <h3 className="font-heading font-semibold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>{selectedComment.name}</h3>
                <StarRatings rating={selectedComment.rating} />
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar" style={{ color: "var(--text-secondary)" }}>
              <p className="text-lg sm:text-xl leading-relaxed font-body font-light whitespace-pre-wrap">"{selectedComment.text}"</p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(74,66,56,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(74,66,56,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(74,66,56,0.3); }
      `}} />
    </section>
  );
}
