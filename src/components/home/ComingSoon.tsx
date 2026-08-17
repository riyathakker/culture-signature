"use client";

import { useEffect, useState } from "react";
import { socialLinks } from "@/constants/constants";

// baseline so the count reads as social proof even at launch
const WAITLIST_BASE = 500;

const SPARKLES = [
  { top: "12%", left: "18%", size: 6, delay: "0s", dur: "3.2s" },
  { top: "22%", left: "82%", size: 4, delay: "0.6s", dur: "4s" },
  { top: "70%", left: "12%", size: 5, delay: "1.1s", dur: "3.6s" },
  { top: "78%", left: "86%", size: 7, delay: "0.3s", dur: "4.4s" },
  { top: "40%", left: "8%", size: 3, delay: "1.6s", dur: "3s" },
  { top: "58%", left: "92%", size: 4, delay: "0.9s", dur: "3.8s" },
  { top: "8%", left: "50%", size: 4, delay: "1.3s", dur: "4.2s" },
  { top: "88%", left: "46%", size: 5, delay: "0.2s", dur: "3.4s" },
  { top: "32%", left: "30%", size: 3, delay: "2.1s", dur: "4.6s" },
  { top: "64%", left: "68%", size: 5, delay: "1.9s", dur: "3.9s" },
  { top: "16%", left: "70%", size: 3, delay: "2.4s", dur: "4.1s" },
  { top: "84%", left: "24%", size: 4, delay: "0.8s", dur: "3.3s" },
];

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [alreadyOnList, setAlreadyOnList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/notify")
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === "number" ? d.count : 0))
      .catch(() => setCount(0));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSubscribed(true);
      setAlreadyOnList(!!data.alreadySubscribed);
      // Only bump the count for a genuinely new signup — an already-subscribed
      // email doesn't add a row, so incrementing would drift until the next refresh.
      if (!data.alreadySubscribed) {
        setCount((c) => (c === null ? c : c + 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const waitlistTotal = count === null ? null : WAITLIST_BASE + count;

  return (
    <main className="cs-coming" role="main">
      <style>{`
        .cs-coming {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          padding: clamp(1.5rem, 5vh, 3rem) 1.5rem 1.5rem;
          overflow: hidden;
          background:
            radial-gradient(120% 90% at 50% 8%, rgba(168, 88, 76, 0.45) 0%, rgba(168, 88, 76, 0) 55%),
            radial-gradient(90% 70% at 50% 100%, rgba(212, 175, 110, 0.18) 0%, rgba(0, 0, 0, 0) 60%),
            linear-gradient(180deg, #33231f 0%, #241713 55%, #1c1210 100%);
          color: #f3ece0;
          isolation: isolate;
        }

        /* drifting aurora glows for depth & motion */
        .cs-aurora {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
          z-index: 0;
          pointer-events: none;
        }
        .cs-aurora.a1 {
          width: 46vw; height: 46vw;
          top: -12%; left: -8%;
          background: radial-gradient(circle, rgba(149,71,61,0.55), rgba(149,71,61,0) 70%);
          animation: cs-drift1 16s ease-in-out infinite;
        }
        .cs-aurora.a2 {
          width: 40vw; height: 40vw;
          bottom: -14%; right: -6%;
          background: radial-gradient(circle, rgba(212,175,110,0.4), rgba(212,175,110,0) 70%);
          animation: cs-drift2 19s ease-in-out infinite;
        }
        .cs-aurora.a3 {
          width: 34vw; height: 34vw;
          top: 40%; left: 55%;
          background: radial-gradient(circle, rgba(120,60,52,0.4), rgba(120,60,52,0) 70%);
          animation: cs-drift3 22s ease-in-out infinite;
        }

        .cs-coming::after {
          /* subtle grain/vignette for depth */
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.32) 100%);
          z-index: 0;
        }
        .cs-coming > *:not(.cs-aurora) { position: relative; z-index: 2; }

        .cs-halo {
          position: relative;
          width: min(42vw, 200px);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
        }
        .cs-halo::before {
          content: "";
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,110,0.28) 0%, rgba(149,71,61,0.10) 40%, rgba(0,0,0,0) 70%);
          filter: blur(6px);
          animation: cs-pulse 6s ease-in-out infinite;
        }
        /* thin static ring around the mandala */
        .cs-halo::after {
          content: "";
          position: absolute;
          inset: -6%;
          border-radius: 50%;
          border: 1px solid rgba(212,175,110,0.22);
        }
        .cs-mandala {
          width: 100%;
          height: 100%;
          object-fit: contain;
          /* recolor the dark terracotta PNG into warm champagne gold */
          filter: brightness(0) saturate(100%) invert(86%) sepia(28%) saturate(620%)
                  hue-rotate(347deg) brightness(98%) contrast(94%)
                  drop-shadow(0 0 18px rgba(212,175,110,0.45));
        }

        .cs-footline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          margin-top: 1.8rem;
          max-width: 92vw;
          animation: cs-rise 1s ease both;
          animation-delay: 0.9s;
        }
        .cs-footline .cs-eyebrow {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .cs-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: rgba(212, 175, 110, 0.85);
        }
        .cs-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-weight: 500;
          margin-top: 1.2rem;
          font-size: clamp(2.1rem, 7vw, 4rem);
          line-height: 1.02;
          background: linear-gradient(100deg, #e9d3a3 0%, #f6ecd6 30%, #caa04f 55%, #f6ecd6 80%, #e9d3a3 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: cs-shimmer 6s linear infinite, cs-rise 1s ease both;
          animation-delay: 0s, 0.2s;
        }
        .cs-sub {
          margin-top: 1.1rem;
          max-width: none;
          white-space: nowrap;
          font-style: italic;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(0.72rem, 2.4vw, 1.18rem);
          line-height: 1.7;
          color: rgba(243, 236, 224, 0.72);
          animation: cs-rise 1s ease both;
          animation-delay: 0.35s;
        }
        .cs-divider {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-top: 1.4rem;
          animation: cs-rise 1s ease both;
          animation-delay: 0.5s;
        }
        .cs-divider span {
          height: 1px;
          width: clamp(48px, 16vw, 110px);
          background: linear-gradient(90deg, rgba(212,175,110,0) 0%, rgba(212,175,110,0.8) 100%);
        }
        .cs-divider span:last-child {
          background: linear-gradient(90deg, rgba(212,175,110,0.8) 0%, rgba(212,175,110,0) 100%);
        }
        .cs-diamond {
          color: #d4af6e;
          font-size: 0.8rem;
          transform: rotate(45deg);
          text-shadow: 0 0 10px rgba(212,175,110,0.6);
        }

        /* glass notify card */
        .cs-notify {
          margin-top: 1.6rem;
          width: min(90vw, 30rem);
          animation: cs-rise 1s ease both;
          animation-delay: 0.6s;
        }
        .cs-notify-label {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(243, 236, 224, 0.72);
          margin-bottom: 0.85rem;
        }
        .cs-notify-label b {
          color: #e5c07a;
          font-weight: 700;
        }
        .cs-form {
          display: flex;
          gap: 0.5rem;
          padding: 0.4rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 175, 110, 0.28);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .cs-form:focus-within {
          border-color: rgba(212, 175, 110, 0.6);
          box-shadow: 0 10px 44px rgba(0,0,0,0.4), 0 0 0 3px rgba(212,175,110,0.12);
        }
        .cs-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: #f3ece0;
          font-size: 0.95rem;
          padding: 0 0.6rem 0 1rem;
          letter-spacing: 0.02em;
        }
        .cs-input::placeholder { color: rgba(243, 236, 224, 0.4); }
        .cs-btn {
          flex-shrink: 0;
          border: none;
          cursor: pointer;
          border-radius: 999px;
          padding: 0.7rem 1.5rem;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          color: #201510;
          background: linear-gradient(135deg, #f6ecd6 0%, #d4af6e 50%, #caa04f 100%);
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .cs-btn:hover { transform: translateY(-1px); filter: brightness(1.06); }
        .cs-btn:active { transform: translateY(0); }
        .cs-btn:disabled { opacity: 0.6; cursor: default; transform: none; }
        .cs-error {
          margin-top: 0.7rem;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          color: #e6a397;
        }
        .cs-count {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.95rem;
          font-size: 0.78rem;
          color: rgba(243, 236, 224, 0.62);
        }
        .cs-count b { color: rgba(243, 236, 224, 0.92); font-weight: 600; }
        .cs-count-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #7bd88f;
          box-shadow: 0 0 8px rgba(123,216,143,0.8);
          animation: cs-pulse 2.4s ease-in-out infinite;
        }

        .cs-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.95rem 1.2rem;
          border-radius: 999px;
          background: rgba(212, 175, 110, 0.1);
          border: 1px solid rgba(212, 175, 110, 0.35);
          color: rgba(243, 236, 224, 0.9);
          font-size: 0.88rem;
          letter-spacing: 0.02em;
          animation: cs-rise 0.5s ease both;
        }
        .cs-success .tick {
          display: grid;
          place-items: center;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f6ecd6, #d4af6e);
          color: #201510;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .cs-socials {
          display: flex;
          gap: 0.9rem;
          margin-top: 1.4rem;
          animation: cs-rise 1s ease both;
          animation-delay: 0.8s;
        }
        .cs-social {
          display: grid;
          place-items: center;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 110, 0.28);
          color: rgba(243, 236, 224, 0.7);
          background: rgba(255,255,255,0.03);
          transition: color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
        }
        .cs-social:hover {
          color: #201510;
          background: linear-gradient(135deg, #f6ecd6, #d4af6e);
          border-color: transparent;
          transform: translateY(-2px);
        }
        .cs-social svg { width: 18px; height: 18px; }

        .cs-sparkle {
          position: absolute;
          z-index: 1;
          border-radius: 50%;
          background: radial-gradient(circle, #fbeecb 0%, #d4af6e 45%, rgba(212,175,110,0) 72%);
          box-shadow: 0 0 8px rgba(212,175,110,0.7);
          animation: cs-twinkle var(--dur, 3.6s) ease-in-out infinite;
        }

        @keyframes cs-pulse {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes cs-shimmer {
          to { background-position: -220% center; }
        }
        @keyframes cs-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes cs-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6%, 8%) scale(1.1); }
        }
        @keyframes cs-drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-7%, -6%) scale(1.12); }
        }
        @keyframes cs-drift3 {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-56%, -8%) scale(0.92); }
        }
        @media (max-width: 990px) {
          .cs-sub {
            white-space: normal;
            max-width: 26rem;
          }
        }
        @media (max-width: 640px) {
          .cs-sub {
            white-space: normal;
            max-width: 22rem;
            font-size: 0.95rem;
          }
          .cs-footline {
            flex-wrap: nowrap;
            justify-content: center;
            gap: 0.5rem;
            max-width: 92vw;
          }
          .cs-eyebrow {
            letter-spacing: 0.16em;
            font-size: 0.6rem;
            white-space: nowrap;
          }
          .cs-form {
            flex-direction: column;
            gap: 0.6rem;
            padding: 0;
            border: none;
            background: none;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
          .cs-form:focus-within {
            border: none;
            box-shadow: none;
          }
          .cs-input {
            width: 100%;
            text-align: center;
            font-size: 0.9rem;
            padding: 0.8rem 0.8rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(212, 175, 110, 0.28);
          }
          .cs-btn {
            width: 100%;
            padding: 0.85rem 1rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-mandala, .cs-halo::before, .cs-halo::after, .cs-title, .cs-sparkle,
          .cs-eyebrow, .cs-sub, .cs-divider, .cs-notify, .cs-socials,
          .cs-count-dot, .cs-footline, .cs-aurora {
            animation: none !important;
          }
          .cs-eyebrow, .cs-sub, .cs-divider, .cs-notify,
          .cs-socials, .cs-footline { opacity: 1; }
        }
      `}</style>

      <div className="cs-aurora a1" aria-hidden="true" />
      <div className="cs-aurora a2" aria-hidden="true" />
      <div className="cs-aurora a3" aria-hidden="true" />

      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="cs-sparkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            ["--dur" as string]: s.dur,
          }}
        />
      ))}

      <div className="cs-halo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cs-mandala" src="/Logo_Without_Text.png" alt="Culture Signature" />
      </div>

      <h1 className="cs-title">Coming Soon</h1>
      <p className="cs-sub">
        Something timeless is being crafted. A new home for artisanal jewellery
        &amp; timepieces — worthy of the wait.
      </p>

      <div className="cs-divider" aria-hidden="true">
        <span />
        <em className="cs-diamond">◆</em>
        <span />
      </div>

      <div className="cs-notify">
        <p className="cs-notify-label">
          Join the waitlist — get <b>10% off</b> your first order
        </p>
        {subscribed ? (
          <div className="cs-success" role="status">
            <span className="tick" aria-hidden="true">✓</span>
            {alreadyOnList
              ? "You're already on the list."
              : "You're on the list. We'll be in touch."}
          </div>
        ) : (
          <form className="cs-form" onSubmit={handleSubmit}>
            <input
              className="cs-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              disabled={submitting}
            />
            <button className="cs-btn" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Notify Me"}
            </button>
          </form>
        )}
        {error && (
          <p className="cs-error" role="alert">
            {error}
          </p>
        )}
        {waitlistTotal !== null && (
          <p className="cs-count">
            <span className="cs-count-dot" aria-hidden="true" />
            <b>{waitlistTotal.toLocaleString()}+</b> jewellery lovers already on the waitlist
          </p>
        )}
      </div>

      <div className="cs-socials">
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            className="cs-social"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon fontSize="small" />
          </a>
        ))}
      </div>

      <div className="cs-footline">
        <span className="cs-eyebrow">Culture Signature By Jalpa Thakkar</span>
      </div>
    </main>
  );
}
