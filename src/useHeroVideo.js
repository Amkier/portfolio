import { useEffect, useRef, useState } from 'react';

export default function useHeroVideo(video) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const wantsPlayback = useRef(!matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData);
  const visible = useRef(false);
  useEffect(() => {
    const el = video.current;
    let disposed = false;
    let allowLoad = !location.hash || location.hash === '#home';
    const sync = () => {
      if (!allowLoad || !visible.current || document.hidden || !wantsPlayback.current) { el.pause(); return; }
      if (!el.getAttribute('src')) {
        el.src = matchMedia('(max-width: 700px)').matches ? '/hero-robot-mobile.mp4' : '/hero-robot-optimized.mp4';
        el.load();
      }
      el.play().then(() => { if (disposed || !visible.current || document.hidden || !wantsPlayback.current) el.pause(); }).catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; if (!visible.current) allowLoad = true; sync(); }, { threshold: .05 });
    const manualPlayback = () => { allowLoad = true; sync(); };
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { wantsPlayback.current = !motion.matches && !navigator.connection?.saveData; sync(); };
    const play = () => setPlaying(true), pause = () => setPlaying(false), loaded = () => setReady(true);
    el.addEventListener('play', play); el.addEventListener('pause', pause); el.addEventListener('loadeddata', loaded);
    el.addEventListener('portfolio-playback', manualPlayback);
    observer.observe(el);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', preference);
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', preference); el.removeEventListener('play', play); el.removeEventListener('pause', pause); el.removeEventListener('loadeddata', loaded); el.removeEventListener('portfolio-playback', manualPlayback); el.pause(); };
  }, [video]);
  const toggle = () => { wantsPlayback.current = !playing; video.current.dispatchEvent(new Event('portfolio-playback')); };
  return { playing, ready, toggle };
}
