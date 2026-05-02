import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from './Sections.jsx';
import HorizontalCarousel from './HorizontalCarousel.jsx';

function ShowcaseImage({ src, alt }) {
  const [currentSrc, setCurrentSrc] = useState(() => src.replace(/\.svg$/i, '.png'));

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      onError={() => {
        if (currentSrc !== src) setCurrentSrc(src);
      }}
    />
  );
}

export default function Showcase() {
  const { t } = useTranslation();
  const items = t('showcase.items', { returnObjects: true });
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="relative content-section py-24 border-t border-[#121820]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader
          id="showcase"
          kicker={t('showcase.kicker')}
          title={t('showcase.title')}
        />
        <p
          className="text-[16px] text-[#9aa7b4] max-w-2xl mb-12 leading-relaxed"
          style={{ textWrap: 'pretty' }}
        >
          {t('showcase.subtitle')}
        </p>

        <HorizontalCarousel
          id="showcase-carousel"
          items={items}
          ariaLabel="Showcase carousel"
          reducedMotion={reducedMotion}
          dragEnabled={false}
          touchSwipeEnabled={false}
          buttonVariant="high-contrast-filled"
          renderItem={(item, i) => (
            <motion.a
              key={item.name}
              href={item.demo_url || undefined}
              target={item.demo_url && item.demo_url.startsWith('http') ? '_blank' : undefined}
              rel={item.demo_url && item.demo_url.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group border border-[#1a2330] bg-[#0a0e12]/50 hover:border-[color:var(--accent)]/60 transition-all duration-200 overflow-hidden flex flex-col h-full ${item.demo_url ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-2' : 'cursor-default'}`}
              aria-disabled={!item.demo_url}
              onClick={(event) => {
                if (!item.demo_url) event.preventDefault();
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#060a0d] border-b border-[#1a2330]">
                <ShowcaseImage src={item.image} alt={item.name} />
                <span className="absolute top-3 right-3 px-2 py-0.5 font-mono text-[10px] bg-[#080c10]/85 backdrop-blur border border-[#a78bfa]/60 text-[#a78bfa]">
                  {item.tag}
                </span>
                <span className="absolute bottom-3 left-3 font-mono text-[10px] text-[#5d6b7a]">
                  {String(i + 1).padStart(2, '0')} / {items.length}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="font-mono text-[11px] text-[#5d6b7a] mb-1.5">{item.category}</div>
                <h3
                  className="text-[18px] font-semibold text-[#e8eef5] group-hover:text-[color:var(--accent)] transition-colors"
                  style={{ textWrap: 'balance' }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-[13px] text-[#9aa7b4] mt-2 leading-relaxed flex-1"
                  style={{ textWrap: 'pretty' }}
                >
                  {item.body}
                </p>

                <div className="flex flex-wrap gap-1 mt-4">
                  {item.stack.slice(0, 4).map((stackItem) => (
                    <span
                      key={stackItem}
                      className="font-mono text-[10px] px-1.5 py-0.5 border border-[#1a2330] text-[#9aa7b4]"
                    >
                      {stackItem}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#121820] gap-3">
                  <span className="font-mono text-[11px] text-[color:var(--accent2)]">{item.metric}</span>
                  {item.demo_url ? (
                    <a
                      href={item.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-[color:var(--accent)] link-u whitespace-nowrap"
                    >
                      live_demo() →
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] text-[#5d6b7a] whitespace-nowrap">
                      in development
                    </span>
                  )}
                </div>
              </div>
            </motion.a>
          )}
        />
      </div>
    </section>
  );
}
