import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useV2Animations(rootRef, heroCanvasApiRef, enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      heroCanvasApiRef?.current?.setScrollProgress?.(0);
      const targets = root.querySelectorAll(
        '[data-hero-el], [data-reveal], [data-stagger-item], [data-hero-hud], [data-scroll-indicator]'
      );
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
      });
      return undefined;
    }

    const hoverCleanups = [];

    const ctx = gsap.context(() => {
      const heroEls = gsap.utils.toArray('[data-hero-el]');
      if (heroEls.length) {
        gsap.set(heroEls, { autoAlpha: 0, y: 28 });
        gsap.timeline({ defaults: { ease: 'power3.out' } }).to(heroEls, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
        });
      }

      const hero = root.querySelector('#v2-hero');
      const heroHud = gsap.utils.toArray('[data-hero-hud]');
      const scrollIndicator = root.querySelector('[data-scroll-indicator]');

      if (heroHud.length) {
        gsap.set(heroHud, { autoAlpha: 0, x: -12 });
        gsap.to(heroHud, {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          delay: 0.45,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }

      if (scrollIndicator) {
        gsap.fromTo(
          scrollIndicator,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.75, ease: 'power2.out' }
        );
        gsap.to(scrollIndicator, {
          y: 10,
          duration: 1.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            heroCanvasApiRef?.current?.setScrollProgress?.(self.progress);
          },
          onRefresh: (self) => {
            heroCanvasApiRef?.current?.setScrollProgress?.(self.progress);
          },
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
          .to(heroEls, {
            autoAlpha: 0.36,
            y: -34,
            scale: 0.98,
            stagger: 0.015,
            ease: 'none',
          }, 0)
          .to(heroHud, {
            autoAlpha: 0.28,
            y: -20,
            ease: 'none',
          }, 0)
          .to(scrollIndicator, {
            autoAlpha: 0,
            y: 26,
            ease: 'none',
          }, 0);
      }

      const revealEls = gsap.utils.toArray('[data-reveal]');
      revealEls.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });

      const nav = root.querySelector('[data-v2-nav]');
      if (nav) {
        let lastY = window.scrollY;
        let navHidden = false;
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const currentY = self.scroll();
            const scrollingDown = currentY > lastY;
            const pastHero = currentY > 80;
            const shouldHide = scrollingDown && pastHero;
            if (shouldHide === navHidden) {
              lastY = currentY;
              return;
            }
            navHidden = shouldHide;
            gsap.to(nav, {
              y: shouldHide ? -72 : 0,
              duration: 0.28,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            lastY = currentY;
          },
        });
      }

      const groups = gsap.utils.toArray('[data-stagger-group]');
      groups.forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: group,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });

      const orb = root.querySelector('.v2-gradient-orb');
      if (orb) {
        gsap.to(orb, {
          x: 36,
          y: -22,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      const cards = root.querySelectorAll('.v2-card');
      cards.forEach((card) => {
        const enter = () => gsap.to(card, { y: -4, scale: 1.01, duration: 0.2, ease: 'power2.out' });
        const leave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
        hoverCleanups.push(() => {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mouseleave', leave);
        });
      });
    }, root);

    return () => {
      hoverCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, [rootRef, heroCanvasApiRef, enabled]);
}
