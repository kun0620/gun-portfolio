import { useEffect, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function HorizontalCarousel({
  id,
  items,
  renderItem,
  ariaLabel,
  reducedMotion = false,
  dragEnabled = true,
  touchSwipeEnabled = true,
  buttonVariant = 'default',
}) {
  const trackRef = useRef(null);
  const pointerRef = useRef(null);
  const [current, setCurrent] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);

  const total = items.length;

  const getStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.querySelector('[data-carousel-card="true"]');
    if (!first) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
    return first.getBoundingClientRect().width + gap;
  };

  const updateStateFromScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const left = track.scrollLeft;
    const step = getStep();
    const rawIndex = step > 1 ? Math.round(left / step) : 0;
    const idx = clamp(rawIndex, 0, Math.max(0, total - 1));
    setCurrent(idx + 1);
    setCanPrev(left > 4);
    setCanNext(left < max - 4);
  };

  useEffect(() => {
    updateStateFromScroll();
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => updateStateFromScroll();
    track.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => updateStateFromScroll();
    window.addEventListener('resize', onResize);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [total]);

  const scrollByStep = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const delta = direction * (getStep() || track.clientWidth * 0.9);
    track.scrollBy({
      left: delta,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const onPointerDown = (event) => {
    if (!dragEnabled) return;
    if (!touchSwipeEnabled && event.pointerType === 'touch') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: track.scrollLeft,
      axis: null,
    };
    track.setPointerCapture(event.pointerId);
    track.classList.add('is-dragging');
  };

  const onPointerMove = (event) => {
    const track = trackRef.current;
    const pointer = pointerRef.current;
    if (!track || !pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    if (!pointer.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      pointer.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (pointer.axis !== 'x') return;
    event.preventDefault();
    track.scrollLeft = pointer.startLeft - dx;
  };

  const onPointerUp = (event) => {
    const track = trackRef.current;
    const pointer = pointerRef.current;
    if (!track || !pointer || pointer.id !== event.pointerId) return;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    track.classList.remove('is-dragging');
    pointerRef.current = null;
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByStep(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByStep(1);
    }
  };

  return (
    <div className="carousel-shell">
      <div className="carousel-controls">
        <div className="font-mono text-[11px] text-[#5d6b7a]">{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`carousel-nav-btn ${buttonVariant === 'high-contrast-filled' ? 'carousel-nav-btn-strong' : ''}`}
            onClick={() => scrollByStep(-1)}
            aria-label={`${ariaLabel} previous`}
            aria-controls={id}
            title="Previous"
            disabled={!canPrev}
          >
            ←
          </button>
          <button
            type="button"
            className={`carousel-nav-btn ${buttonVariant === 'high-contrast-filled' ? 'carousel-nav-btn-strong' : ''}`}
            onClick={() => scrollByStep(1)}
            aria-label={`${ariaLabel} next`}
            aria-controls={id}
            title="Next"
            disabled={!canNext}
          >
            →
          </button>
        </div>
      </div>

      <div className="carousel-edge-mask">
        <div
          id={id}
          ref={trackRef}
          className={`carousel-track ${reducedMotion ? 'carousel-track-reduced' : ''}`}
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={dragEnabled ? onPointerMove : undefined}
          onPointerUp={dragEnabled ? onPointerUp : undefined}
          onPointerCancel={dragEnabled ? onPointerUp : undefined}
        >
          {items.map((item, index) => (
            <div key={item.id ?? item.name ?? index} data-carousel-card="true" className="carousel-card-snap">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
