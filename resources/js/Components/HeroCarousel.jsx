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
        <section id="hero" className="w-full relative overflow-hidden -mt-20">
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
                        className="w-full shrink-0 flex-none aspect-[16/9] min-h-[440px] sm:min-h-[540px] lg:min-h-[640px] max-h-[90vh] snap-center relative overflow-hidden bg-[#0E0E0E]"
                    >
                        {/* High-Resolution Absolute Positioning HTML Image for Crisp Sharpness */}
                        <img
                            src={item.bgImage}
                            alt={item.title}
                            className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out pointer-events-none ${
                                activeIndex === index ? 'scale-100 opacity-100' : 'scale-105 opacity-80'
                            }`}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />

                        {/* Subtle Dark Gradient Overlay for High Text Readability & Image Clarity */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 via-[#121212]/30 to-transparent pointer-events-none" />

                        {/* Content Container (Aligned with Site Grid) */}
                        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 md:px-16 h-full flex flex-col justify-end pb-12 sm:pb-16 md:pb-20 relative z-10">
                            <div className="max-w-xl sm:max-w-2xl space-y-2 sm:space-y-3">
                                {/* Subtitle Badge with Dash */}
                                <div className="flex items-center gap-2.5">
                                    <span className="w-6 h-[2px] bg-[#FF6B00]" />
                                    <span className="font-bold text-xs sm:text-sm text-[#FF6B00] tracking-wide uppercase">
                                        {item.badge}
                                    </span>
                                </div>

                                {/* Main Title */}
                                <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-white tracking-wide leading-[0.95] drop-shadow-md">
                                    {item.title}
                                </h1>

                                {/* Subtitle / Description Paragraph */}
                                {item.subtitle && (
                                    <p className="text-xs sm:text-sm md:text-base text-[#E0E0E0]/90 leading-relaxed font-light max-w-lg line-clamp-2 sm:line-clamp-none pt-1">
                                        {item.subtitle}
                                    </p>
                                )}

                                {/* Optional CTA Button */}
                                {item.ctaText && (
                                    <div className="pt-3">
                                        <a
                                            href={item.ctaLink || '#'}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-105 transition-all"
                                        >
                                            <span>{item.ctaText}</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots Positioned inside Banner Overlay */}
            {promoItems.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-2">
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
