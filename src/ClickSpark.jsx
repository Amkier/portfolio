// Adapted from the React Bits ClickSpark source supplied by the user.
import { useEffect, useRef } from 'react';

export default function ClickSpark({ sparkColor = '#a9caff', sparkSize = 10, sparkRadius = 22, sparkCount = 8, duration = 400, easing = 'ease-out', extraScale = 1, children }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let sparks = [], frame = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sparks = [];
    };
    const ease = t => easing === 'linear' ? t : easing === 'ease-in' ? t * t : easing === 'ease-in-out' ? (t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t) : t * (2 - t);
    const draw = now => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      sparks = sparks.filter(s => now - s.time < duration);
      for (const s of sparks) {
        const progress = Math.min(1, (now - s.time) / duration);
        const eased = ease(progress);
        const distance = eased * sparkRadius * extraScale;
        const length = sparkSize * (1 - eased);
        ctx.strokeStyle = sparkColor;
        ctx.globalAlpha = 1 - progress;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x + distance * Math.cos(s.angle), s.y + distance * Math.sin(s.angle));
        ctx.lineTo(s.x + (distance + length) * Math.cos(s.angle), s.y + (distance + length) * Math.sin(s.angle));
        ctx.stroke();
      }
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };
    const click = e => {
      if (reduced.matches || e.detail === 0 || duration <= 0) return;
      if (e.target.closest?.('dialog') !== canvas.closest('dialog')) return;
      const rect = canvas.getBoundingClientRect();
      const time = performance.now();
      sparks.push(...Array.from({ length: sparkCount }, (_, i) => ({ x: e.clientX - rect.left, y: e.clientY - rect.top, angle: 2 * Math.PI * i / sparkCount, time })));
      sparks = sparks.slice(-160);
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const clear = () => { sparks = []; cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); };
    resize();
    document.addEventListener('click', click, true);
    window.addEventListener('resize', resize);
    reduced.addEventListener('change', clear);
    document.addEventListener('visibilitychange', clear);
    return () => { clear(); document.removeEventListener('click', click, true); window.removeEventListener('resize', resize); reduced.removeEventListener('change', clear); document.removeEventListener('visibilitychange', clear); };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);
  return <>{children}<canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true"/></>;
}
