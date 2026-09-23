// Adapted from the React Bits AccordionGallery supplied by the user.
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './AccordionGallery.css';
import Arrow from './Arrow';

export default function AccordionGallery({ items, onOpen, defaultIndex = 0 }) {
  const [active, setActive] = useState(defaultIndex);
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 700px)').matches);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const root = useRef(null);
  const panels = useRef([]);
  const pointer = useRef({ x: -1, y: -1 });
  const controls = useRef([]);
  useEffect(() => {
    const small = matchMedia('(max-width: 700px)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setMobile(small.matches); setReduced(motion.matches); };
    small.addEventListener('change', update); motion.addEventListener('change', update);
    return () => { small.removeEventListener('change', update); motion.removeEventListener('change', update); };
  }, []);
  useEffect(() => {
    const animations = [];
      panels.current.forEach((panel, index) => {
        const open = index === active;
        animations.push(gsap.to(panel, { flexGrow: open ? (mobile ? 5 : 4.6) : 1, duration: reduced ? 0 : .8, ease: 'power3.out', overwrite: true }));
        animations.push(gsap.to(panel.querySelector('img'), { opacity: open ? 1 : .78, duration: reduced ? 0 : .5, overwrite: true }));
      });
    return () => animations.forEach(animation => animation.kill());
  }, [active, mobile, reduced]);
  useEffect(() => {
    const el = root.current;
    const measure = () => el.style.setProperty('--ag-image-width', `${mobile ? el.clientWidth : (el.clientWidth - 36) * 4.6 / 7.6}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mobile]);
  const navigate = (e, i) => {
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % items.length : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + items.length) % items.length : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null;
    if (next !== null) { e.preventDefault(); controls.current[next].focus(); setActive(next); }
  };
  return <div ref={root} className="accordion-gallery" aria-label="作品手风琴画廊">
    {items.map((item, i) => <article key={item.id} ref={el => panels.current[i] = el} className={`ag-panel${active === i ? ' ag-active' : ''}`} onPointerMove={e => { const moved = Math.abs(e.clientX-pointer.current.x)+Math.abs(e.clientY-pointer.current.y)>2; pointer.current={x:e.clientX,y:e.clientY}; if (moved && !mobile && e.pointerType === 'mouse' && !document.activeElement?.matches('.ag-select:focus-visible, .ag-open:focus-visible')) setActive(i); }}>
      <div className="ag-art"><img src={item.image} srcSet={`${item.image.replace('.webp','-960.webp')} 960w, ${item.image} 1920w`} sizes="(max-width: 700px) 90vw, 65vw" decoding="async" width="1920" height="1080" alt={item.name} loading="lazy" draggable="false"/></div>
      <button className="ag-select" ref={el => controls.current[i] = el} onFocus={() => setActive(i)} onClick={() => setActive(i)} onKeyDown={e => navigate(e, i)} aria-expanded={active === i} aria-controls={`ag-details-${item.id}`} aria-label={`展开${item.name}`}><span className="ag-number">{item.id}</span><span className="ag-short">{item.shortName}</span></button>
      <div className="ag-caption" id={`ag-details-${item.id}`} aria-hidden={active !== i} inert={active !== i}>
        <span className="ag-category">{item.type} / {item.pages[0]}—{item.pages.at(-1)}</span>
        <h3>{item.name}</h3><p>{item.subtitle}</p>
        <button className="ag-open" onClick={() => onOpen(item)} aria-label={`查看${item.name}项目详情`}>查看设计过程 <Arrow/></button>
      </div>
    </article>)}
  </div>;
}




