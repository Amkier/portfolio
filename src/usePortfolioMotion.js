import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion() {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const deepLink = location.hash && location.hash !== '#home';
        let seenOpening = false;
        try { seenOpening = sessionStorage.getItem('portfolio-opening') === 'seen'; } catch { /* Storage may be disabled. */ }
        const intro = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
        if (!seenOpening && !deepLink && scrollY < innerHeight * .3) {
          try { sessionStorage.setItem('portfolio-opening', 'seen'); } catch { /* Animation works without storage. */ }
          gsap.set('.opening-screen', { visibility: 'visible' });
          intro.fromTo('.opening-word', { yPercent: 120, scaleX: .75 }, { yPercent: 0, scaleX: 1, duration: 1.05 })
            .fromTo('.opening-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, .15)
            .to('.opening-word', { yPercent: -125, duration: .7 }, 1.1)
            .to('.opening-panel', { yPercent: i => i === 0 ? -101 : 101, duration: 1.3, stagger: .08 }, 1.25)
            .set('.opening-screen', { visibility: 'hidden' }, 2.65)
            .from('.hero .hero-visual', { scale: 1.14, duration: 2.2, ease: 'power3.out' }, 1.3)
            .from('.hero-title-char', { yPercent: 130, rotate: 8, scaleX: .55, transformOrigin: '0% 100%', stagger: .055, duration: 1.45, ease: 'power4.out' }, 1.7)
            .from('.header', { y: -90, duration: 1.2, ease: 'power3.out' }, 1.75)
            .from('.hero-edition,.hero-caption,.hero-disciplines,.hero-bottom,.hero-topline', { y: 35, autoAlpha: 0, stagger: .09, duration: 1, ease: 'power3.out' }, 2.25);
          // Navigation stays usable, and scrolling away cancels the opening overlay.
          ScrollTrigger.create({ trigger: '#home', start: 'bottom top', onEnter: () => intro.progress(1) });
        }
        const scenes = [
          ['#about', '.bio-heading>span', '.bio-identity,.bio-intro,.bio-experiences article,.bio-tools,.bio-bottom', '.bio-portrait'],
          ['#work', '.summary-heading h2', '.summary-heading p,.ag-art,.summary-footer', null],
          ['#strengths', '.motion-section-title', '.section-heading,.strength-card,.design-note', null],
          ['#contact', '.motion-section-title', '#contact-title,.contact-row,.contact-details>div,footer', null],
        ];
        scenes.forEach(([sectionSelector, titleSelector, contentSelector, imageSelector]) => {
          const section = document.querySelector(sectionSelector);
          if (!section) return;
          const title = section.querySelector(titleSelector);
          const contents = section.querySelectorAll(contentSelector);
          const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 82%', once: true }, defaults: { ease: 'power4.out' } });
          if (title) timeline.from(title, { x: innerWidth < 700 ? -55 : -150, y: 85, scaleX: .76, skewX: -7, clipPath: 'inset(0 100% 0 0)', duration: 1.45, transformOrigin: 'left center' }, 0);
          timeline.from(contents, { y: innerWidth < 700 ? 50 : 90, clipPath: 'inset(0 0 100% 0)', stagger: .13, duration: 1.25 }, .42);
          if (imageSelector) {
            const frame = section.querySelector(imageSelector);
            timeline.from(frame, { clipPath: 'inset(100% 0 0 0)', duration: 1.65, ease: 'power3.inOut' }, .25);
            if (matchMedia('(min-width: 701px) and (pointer: fine)').matches) {
              const image = frame.querySelector('img');
              gsap.fromTo(image, { yPercent: -3, scale: 1.08 }, { yPercent: 3, scale: 1.08, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
            }
          }
        });
        ScrollTrigger.refresh();
      });
    });
    return () => { media.revert(); context.revert(); };
  }, []);
}

