import React, { useState, useEffect, useRef } from 'react';

export default function HeroCarousel({ items = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    // If there are no hero banners in the database, don't render the section
    if (!items || items.length === 0) {
        return null;
    }

    const promoItems = items.map(b => ({
        badge: b.badge || 'Pintu Dua Coffeehouse',
        title: b.title,
        subtitle: b.subtitle || '',
        bgImage: b.image_url,
        ctaText: b.cta_text,
        ctaLink: b.cta_link,
    }));

    // Auto-play timer
    useEffect(() => {
        if (isPaused || promoItems.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex(prev => {
                const nextIndex = (prev + 1) % promoItems.length;
                scrollToIndex(nextIndex);
                return nextIndex;
            });
        }, 4500);

        return () => clearTimeout(interval);
    }, [isPaused, promoItems]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollPosition = container.scrollLeft;
        const containerWidth = container.clientWidth || 300;
        const index = Math.round(scrollPosition / containerWidth);
        if (index !== activeIndex && index >= 0 && index < promoItems.length) {
            setActiveIndex(index);
        }
    };

    const scrollToIndex = (index) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const containerWidth = container.clientWidth || 300;
        container.scrollTo({
            left: index * containerWidth,
            behavior: 'smooth',
        });
        setActiveIndex(index);
    };

    return (
        <section id="hero" className="w-full relative overflow-hidden -mt-20 lg:pt-24 pb-0 lg:pb-12 bg-[#121212]">
            {/* Full Screen Edge-to-Edge Carousel Slider Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            >
                {promoItems.map((item, index) => (
                    <div
                        key={index}
                        className="w-full shrink-0 flex-none h-[100dvh] lg:h-[560px] snap-center relative overflow-hidden bg-[#121212]"
                    >
                        {/* DESKTOP SPLIT LAYOUT (2 Columns: Text Left, Photo Right) */}
                        <div className="hidden lg:flex w-full h-full max-w-screen-2xl mx-auto items-center">
                            {/* Left Text Column */}
                            <div className="w-1/2 h-full flex flex-col justify-center px-12 xl:px-20 space-y-4 z-10 bg-[#121212]">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-[2px] bg-[#FF6B00]" />
                                    <span className="font-bold text-sm text-[#FF6B00] tracking-wide uppercase">
                                        {item.badge}
                                    </span>
                                </div>
                                <h1 className="font-display text-5xl xl:text-6xl uppercase text-white tracking-wide leading-[1.0]">
                                    {item.title}
                                </h1>
                                {item.subtitle && (
                                    <p className="text-sm xl:text-base text-[#E0E0E0]/80 leading-relaxed font-light max-w-lg">
                                        {item.subtitle}
                                    </p>
                                )}
                                {item.ctaText && (
                                    <div className="pt-2">
                                        <a
                                            href={item.ctaLink || '#'}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-105 transition-all"
                                        >
                                            <span>{item.ctaText}</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </a>
                                    </div>
                                )}

                                {/* Desktop Pagination Dots (Placed under text on Left Column) */}
                                {promoItems.length > 1 && (
                                    <div className="pt-4 flex items-center gap-2">
                                        {promoItems.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => scrollToIndex(idx)}
                                                onMouseEnter={() => {
                                                    setIsPaused(true);
                                                    scrollToIndex(idx);
                                                }}
                                                className={`h-2.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                                                    activeIndex === idx
                                                        ? 'w-10 bg-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.6)]'
                                                        : 'w-2.5 bg-white/30 hover:bg-white/70'
                                                }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Photo Column */}
                            <div className="w-1/2 h-full relative overflow-hidden p-6">
                                <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl bg-[#181818]">
                                    <img
                                        src={item.bgImage}
                                        alt={item.title}
                                        className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                                            activeIndex === index ? 'scale-100 opacity-100' : 'scale-105 opacity-90'
                                        }`}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MOBILE OVERLAY LAYOUT (Full Screen Edge-to-Edge with Soft Gradient) */}
                        <div className="lg:hidden w-full h-full relative">
                            <img
                                src={item.bgImage}
                                alt={item.title}
                                className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out pointer-events-none ${
                                    activeIndex === index ? 'scale-100 opacity-100' : 'scale-105 opacity-100'
                                }`}
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />

                            {/* Soft Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/35 to-transparent pointer-events-none" />

                            {/* Mobile Content Container */}
                            <div className="w-full h-full flex flex-col justify-end pb-20 px-6 sm:px-10 relative z-10">
                                <div className="space-y-2 sm:space-y-3 max-w-xl">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-6 h-[2px] bg-[#FF6B00]" />
                                        <span className="font-bold text-xs sm:text-sm text-[#FF6B00] tracking-wide uppercase">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <h1 className="font-display text-3xl sm:text-5xl uppercase text-white tracking-wide leading-[0.95] drop-shadow-md">
                                        {item.title}
                                    </h1>
                                    {item.subtitle && (
                                        <p className="text-xs sm:text-sm text-[#E0E0E0]/90 leading-relaxed font-light line-clamp-3 pt-1">
                                            {item.subtitle}
                                        </p>
                                    )}
                                    {item.ctaText && (
                                        <div className="pt-3">
                                            <a
                                                href={item.ctaLink || '#'}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm"
                                            >
                                                <span>{item.ctaText}</span>
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Animated Scroll Down Hint Indicator */}
            <div className="absolute bottom-2 left-0 right-0 z-20 flex sm:hidden justify-center items-center pointer-events-none opacity-60">
                <span className="material-symbols-outlined text-[#FF6B00] animate-bounce text-xl">keyboard_arrow_down</span>
            </div>

            {/* Mobile Pagination Dots */}
            {promoItems.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 z-20 flex lg:hidden justify-center items-center gap-2">
                    {promoItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToIndex(index)}
                            onMouseEnter={() => {
                                setIsPaused(true);
                                scrollToIndex(index);
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                                activeIndex === index
                                    ? 'w-10 bg-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.6)]'
                                    : 'w-2.5 bg-white/40 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
