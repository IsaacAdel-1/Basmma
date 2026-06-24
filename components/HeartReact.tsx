"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const HEART =
  "M12 21s-6.7-4.35-9.33-7.61C.9 11.1 1.07 8.1 3.2 6.36a4.6 4.6 0 0 1 6.16.5L12 9.5l2.64-2.64a4.6 4.6 0 0 1 6.16-.5c2.13 1.74 2.3 4.74.53 7.03C18.7 16.65 12 21 12 21z";

// little hearts that fly outward on like
const PARTICLES = [
  { x: -22, y: -26, s: 0.7, r: -25 },
  { x: 0, y: -34, s: 0.9, r: 0 },
  { x: 22, y: -26, s: 0.7, r: 25 },
  { x: -30, y: -6, s: 0.55, r: -45 },
  { x: 30, y: -6, s: 0.55, r: 45 },
];

export default function HeartReact({
  productKey,
  likes,
  initialLiked = false,
}: {
  productKey: string;
  likes: number;
  initialLiked?: boolean;
}) {
  const [count, setCount] = useState(likes);
  // source of truth = the server (by IP); keeps the heart red on reload
  const [liked, setLiked] = useState(initialLiked);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0); // bump to replay the particle burst

  // keep in sync if the server value changes between renders
  useEffect(() => {
    setLiked(initialLiked);
    setCount(likes);
  }, [initialLiked, likes]);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation(); // don't open the lightbox
    if (busy) return;
    setBusy(true);

    const next = !liked;
    // optimistic update + burst only when liking
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    if (next) setBurst((b) => b + 1);

    try {
      const res = await fetch("/api/react", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: productKey }),
      });
      const j = await res.json();
      if (res.ok && j.ok) {
        setLiked(j.liked);
        setCount(j.likes);
      } else {
        // revert on failure
        setLiked(!next);
        setCount((c) => Math.max(0, c + (next ? -1 : 1)));
      }
    } catch {
      setLiked(!next);
      setCount((c) => Math.max(0, c + (next ? -1 : 1)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label="أعجبني"
      className={`group/heart mt-2.5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-300 ${
        liked
          ? "border-wine/30 bg-wine/10"
          : "border-line bg-white hover:border-wine/40 hover:bg-wine/[.04]"
      }`}
    >
      <span className="relative grid place-items-center">
        {/* flying hearts burst */}
        <AnimatePresence>
          {burst > 0 && (
            <span key={burst} className="pointer-events-none absolute inset-0">
              {PARTICLES.map((p, i) => (
                <motion.svg
                  key={i}
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  initial={{ opacity: 0.9, x: 0, y: 0, scale: 0.2 }}
                  animate={{ opacity: 0, x: p.x, y: p.y, scale: p.s, rotate: p.r }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 fill-red-brand"
                >
                  <path d={HEART} />
                </motion.svg>
              ))}
            </span>
          )}
        </AnimatePresence>

        {/* soft glow when liked */}
        <span
          className={`absolute h-7 w-7 rounded-full bg-red-brand/25 blur-md transition-opacity duration-300 ${
            liked ? "opacity-100" : "opacity-0"
          }`}
        />

        <motion.svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          animate={
            liked
              ? { scale: [1, 1.35, 0.92, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className={`relative transition-colors duration-300 ${
            liked
              ? "fill-red-brand stroke-red-brand"
              : "fill-transparent stroke-gray-brand group-hover/heart:stroke-wine"
          }`}
          strokeWidth={1.8}
        >
          <path d={HEART} />
        </motion.svg>
      </span>

      {count > 0 && (
        <span className="relative h-[1.05rem] min-w-[0.6rem] overflow-hidden text-[.82rem] font-bold leading-[1.05rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`block ${liked ? "text-wine" : "text-ink-2"}`}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </button>
  );
}
