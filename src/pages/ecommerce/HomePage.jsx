import { useLang } from '../../context/LangContext.jsx';

const featured = [
  {
    id: 1,
    tag: 'Hardware',
    name: 'Phantom Mechanical Keyboard',
    price: '$249',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnCAG3w_XbiFsXs07zNSuFvH9kFUFC0LOy_mgkZeOTvnwtgb03R4KiMt3m1NzzXGscmiw-EGt_y0y-mq1u8XgiRv1b54N5BR9ldCpYLcA1ZnAajf9OjRrbGpLFneBQ8xpU8pbPPdzZIENmJ6cirSt2l0oU-E4T7OSImxEGql1swFGe04eh7a-rTBRAxilscE9UCJLmaN2u8xdlS1R3WbjwvQ2X_529W_OO5FwxRneR-Fvt2LjSifYaJb9c6Lsg268DhA2H2Nw35FC-',
  },
  {
    id: 2,
    tag: 'Audio',
    name: 'Void Over-Ear Audio',
    price: '$320',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBF0pvFcGT4gA3YngKbR3g5HUT6JopORPXZoERg9FC0mRhDDOBuEZKwYGivsV_F1JpupS5LHQ47vvtRgOYMCUkbCfnUX_mQcO2Y81lvNtgFwbeOcVaclZA2FMJ09-_L16xg35mD9oCin6nMkcmCyS2eE6xfz5xmfHoY27hG_dD6Z9hKY_LBRmW2IZRcLkIIErP5Rv8dJbOrc4grL0iZSFDbNjkBvBJ4gO1FRnf7ccOAbQuZDUYPBbsTgNWZvThjknPi1KO44ylMVgLS',
  },
  {
    id: 3,
    tag: 'Wearables',
    name: 'Nexus Chronograph',
    price: '$195',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOhM4pqIYpsUt7t-IFjxiTuFLZ4Pi1IcZFgiFxn-i6dGc8TEnUU9XVPpjnLdr0jMMixAlYiWln5rZdiwMuyQgME0_lkxUbbAPLjLaHaxARGyT4sbhMN0W3s5rVrJOsDmxUptBWrwBBkDDGEOGYvSFIJXaBMheiGl4TURKraUqFn9_yWuBtmu35KBXGbfYRNldAZyXkpNCrzTTFxpu-1qJn2a8JuPLTNyzHl8WXHmQPAivASQu5sOjydWotJEesPtSGLrrhuWOwPyw-',
  },
];

export default function HomePage({ onShopNow }) {
  const { tr } = useLang();

  return (
    <>
      <section className="relative flex min-h-[920px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Hero Background"
            className="h-full w-full object-cover opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd3ckheEtX0vwg67eAVdNrjl5ztFAHchRsrLlLXRXK29762zOHwCHOH0kU4fGoI0sam0S1QG0aVjhyZVP4BP6zQfMNXVPPv4ZwK-AQPD8kl0UgDAKczEUK-Y5iLZAOXO30O-YBjZR1PPgnHQtgSxkfhF12HBZhuvELPN68uebKLyJp-FqkPsER6f6QWWW1cNPBs_Zs5k2K_HJUUez__UOguUKgRraNdEGNNFAxKL_dDRD5Hma0K6Gf0cY9nJXIlAYq_8n82aUXOUcy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-80" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-12 px-6 text-center md:flex-row md:text-left">
          <div className="max-w-3xl flex-1">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#111111]/60 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#F0F0F0]">{tr.heroTag}</span>
            </div>
            <h1 className="mb-6 font-['Rubik'] text-[clamp(3rem,7vw,5.8rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#F0F0F0]">
              {tr.heroTitle[0]} <span className="text-amber-500">{tr.heroTitle[1]}</span>
            </h1>
            <p className="mb-10 max-w-xl text-[18px] font-light leading-[1.6] text-[#888888]">{tr.heroSub}</p>
            <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row md:items-start">
              <button type="button" onClick={onShopNow} className="w-full rounded bg-amber-500 px-8 py-4 text-[15px] font-bold uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] sm:w-auto">
                {tr.heroBtn}
              </button>
              <button type="button" className="w-full rounded border border-[#2A2A2A] px-8 py-4 text-[15px] font-bold uppercase tracking-wider text-[#F0F0F0] transition-all duration-300 hover:border-[#444444] hover:bg-[#1A1A1A] sm:w-auto">
                {tr.heroBtnSecondary}
              </button>
            </div>
          </div>
          <div className="relative hidden h-[600px] w-full max-w-lg flex-1 md:block">
            <img
              alt="Featured Product"
              className="h-full w-full rounded-xl border border-[#2A2A2A]/60 object-cover opacity-90 mix-blend-lighten shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgBGT7GBlKixjbyLfjuWjPyWj48r55jmW-sB_vuYK3bH8dqfKQOoeb5BIdWFvl2fMIzx2H4JrIlGdXWHdzVjEYT-6X_YzcNEQ4sHP5it3DGHL-0G5gzR6EM0bft3l9SJyhqVytZQ_8Ygd5az_WpG6P9XgYR9vZZYqYcZIDqTvQSXknUvpnteds2g-vJ6oxvCxZ3t2tzF4Cb-D0AI6R_CeBSSCUcA5ATkBkN1XYL7PfdFCoMKBfekbwf9xTaEp9evrUTbKAz1wSF1AS"
            />
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-[#050505] px-6 py-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-['Rubik'] text-[36px] font-bold text-[#F0F0F0]">Featured Gear</h2>
              <div className="mt-4 h-1 w-12 bg-amber-500" />
            </div>
            <button type="button" className="hidden items-center gap-2 text-[15px] font-bold text-[#888888] hover:text-amber-500 sm:flex">
              {tr.viewAll}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#444444]">
                <button type="button" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A2A] bg-black/40 text-[#888888] transition-colors hover:border-amber-500/50 hover:text-amber-500">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <div className="relative aspect-square overflow-hidden bg-[#1A1A1A]">
                  <img className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100" alt={item.name} src={item.image} />
                </div>
                <div className="p-6">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[#888888]">{item.tag}</div>
                  <div className="mb-6 flex items-start justify-between">
                    <h3 className="pr-4 font-['Rubik'] text-[14px] text-[#F0F0F0]">{item.name}</h3>
                    <span className="whitespace-nowrap font-['Rubik'] text-[16px] font-semibold text-amber-500">{item.price}</span>
                  </div>
                  <button type="button" onClick={onShopNow} className="w-full rounded border border-[#2A2A2A] bg-[#1A1A1A] py-3 text-[15px] font-bold text-[#F0F0F0] transition-all duration-200 hover:border-amber-500/50 hover:text-amber-500">
                    {tr.addToCart}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
