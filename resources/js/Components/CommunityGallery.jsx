import React, { useState, useRef } from 'react';

export default function CommunityGallery({ items = [] }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [vibeIndex, setVibeIndex] = useState(0);
    const [communityIndex, setCommunityIndex] = useState(0);

    const vibeScrollRef = useRef(null);
    const communityScrollRef = useRef(null);

    const vibePhotos = (items || []).filter(i => i.category === 'vibe').map(i => ({
        url: i.image_url,
        title: i.title,
        desc: i.description || '',
    }));

    const communityPhotos = (items || []).filter(i => i.category !== 'vibe').map(i => ({
        url: i.image_url,
        title: i.title,
        desc: i.description || '',
    }));

    const handleScroll = (ref, setIndex, itemsLength) => {
        if (!ref.current || itemsLength === 0) return;
        const container = ref.current;
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.firstElementChild?.clientWidth || 260;
        const gap = 16;
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));
        setIndex(Math.max(0, Math.min(itemsLength - 1, newIndex)));
    };

    const scrollContainer = (ref, direction) => {
        if (!ref.current) return;
        const container = ref.current;
        const cardWidth = container.firstElementChild?.clientWidth || 260;
        const scrollAmount = direction === 'next' ? cardWidth + 16 : -(cardWidth + 16);
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const scrollToIndex = (ref, index, setIndex) => {
        if (!ref.current) return;
        const container = ref.current;
        const targetChild = container.children[index];
        if (targetChild) {
            targetChild.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
            setIndex(index);
        }
    };

    return (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 mb-12 sm:mb-16">
            {/* SECTION 1: Cafe Vibe & Atmosphere */}
            <section id="vibe-section">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="section-accent" />
                        <h3 className="section-title">
                            The Space
                        </h3>
                    </div>

                    {vibePhotos.length > 0 && (
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scrollContainer(vibeScrollRef, 'prev')}
                                className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-white/10 flex items-center justify-center text-white/80 hover:text-[#FF6B00] hover:bg-white/5 hover:border-[#FF6B00]/40 transition-all duration-300 shadow-md"
                                aria-label="Previous Vibe Photo"
                            >
                                <span className="material-symbols-outlined text-xl">chevron_left</span>
                            </button>
                            <button
                                onClick={() => scrollContainer(vibeScrollRef, 'next')}
                                className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-white/10 flex items-center justify-center text-white/80 hover:text-[#FF6B00] hover:bg-white/5 hover:border-[#FF6B00]/40 transition-all duration-300 shadow-md"
                                aria-label="Next Vibe Photo"
                            >
                                <span className="material-symbols-outlined text-xl">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>

                {vibePhotos.length === 0 ? (
                    <div className="p-8 text-center text-[#E0E0E0]/60 italic glass-card rounded-2xl border border-white/10">
                        Belum ada foto Cafe Vibe di database. Tambahkan foto dari Admin Panel.
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Option B Horizontal Touch Swipe Carousel (Portrait 4:5) */}
                        <div
                            ref={vibeScrollRef}
                            onScroll={() => handleScroll(vibeScrollRef, setVibeIndex, vibePhotos.length)}
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 pt-1 sm:hidden"
                        >
                            {vibePhotos.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedPhoto(img)}
                                    className="flex-none w-[72vw] aspect-[4/5] snap-center rounded-3xl overflow-hidden border border-white/10 bg-[#181818] relative group cursor-pointer shadow-xl active:scale-98 transition-all duration-300"
                                >
                                    <img
                                        src={img.url}
                                        alt={img.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />

                                    {/* <div className="absolute top-3 left-3 z-10">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#FF6B00] bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FF6B00]/30 shadow-md">
                                            Cafe Vibe
                                        </span>
                                    </div> */}

                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                                        <h4 className="font-display text-lg text-white group-hover:text-[#FF6B00] transition-colors duration-300 mb-1 leading-tight">
                                            {img.title}
                                        </h4>
                                        {img.desc && (
                                            <p className="text-[11px] text-[#E0E0E0]/80 line-clamp-2 leading-relaxed">
                                                {img.desc}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Indicators */}
                        <div className="flex justify-center items-center mt-3 gap-2 sm:hidden">
                            {vibePhotos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToIndex(vibeScrollRef, index, setVibeIndex)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                                        vibeIndex === index
                                            ? 'w-8 bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.5)]'
                                            : 'w-2 bg-white/20'
                                    }`}
                                    aria-label={`Go to Vibe slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Desktop View: Option 1 Masonry Mosaic Grid */}
                        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {vibePhotos.map((img, index) => {
                                const isFeature = index === 0;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPhoto(img)}
                                        className={`rounded-3xl overflow-hidden border border-white/10 bg-[#181818] relative group cursor-pointer shadow-xl hover:border-[#FF6B00]/60 transition-all duration-500 ${
                                            isFeature
                                                ? 'sm:col-span-2 sm:row-span-2 h-[480px] sm:h-[520px]'
                                                : 'h-[240px] sm:h-[248px]'
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />

                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6B00] bg-[#121212]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FF6B00]/30 shadow-md">
                                                Cafe Vibe
                                            </span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 pointer-events-none">
                                            <h4 className={`font-display uppercase text-white group-hover:text-[#FF6B00] transition-colors duration-300 mb-1 leading-tight ${isFeature ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
                                                {img.title}
                                            </h4>
                                            {img.desc && (
                                                <p className={`text-xs text-[#E0E0E0]/80 leading-relaxed ${isFeature ? 'line-clamp-3' : 'line-clamp-1'}`}>
                                                    {img.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            {/* SECTION 2: Community & People */}
            <section id="community-section">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="section-accent" />
                        <h3 className="section-title">
                            The Crowd
                        </h3>
                    </div>

                    {communityPhotos.length > 0 && (
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scrollContainer(communityScrollRef, 'prev')}
                                className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-white/10 flex items-center justify-center text-white/80 hover:text-[#FF6B00] hover:bg-white/5 hover:border-[#FF6B00]/40 transition-all duration-300 shadow-md"
                                aria-label="Previous Community Photo"
                            >
                                <span className="material-symbols-outlined text-xl">chevron_left</span>
                            </button>
                            <button
                                onClick={() => scrollContainer(communityScrollRef, 'next')}
                                className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-white/10 flex items-center justify-center text-white/80 hover:text-[#FF6B00] hover:bg-white/5 hover:border-[#FF6B00]/40 transition-all duration-300 shadow-md"
                                aria-label="Next Community Photo"
                            >
                                <span className="material-symbols-outlined text-xl">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>

                {communityPhotos.length === 0 ? (
                    <div className="p-8 text-center text-[#E0E0E0]/60 italic glass-card rounded-2xl border border-white/10">
                        Belum ada foto Community & People di database. Tambahkan foto dari Admin Panel.
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Option B Horizontal Touch Swipe Carousel (Portrait 4:5) */}
                        <div
                            ref={communityScrollRef}
                            onScroll={() => handleScroll(communityScrollRef, setCommunityIndex, communityPhotos.length)}
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 pt-1 sm:hidden"
                        >
                            {communityPhotos.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedPhoto(img)}
                                    className="flex-none w-[72vw] aspect-[4/5] snap-center rounded-3xl overflow-hidden border border-white/10 bg-[#181818] relative group cursor-pointer shadow-xl active:scale-98 transition-all duration-300"
                                >
                                    <img
                                        src={img.url}
                                        alt={img.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />

                                    {/* <div className="absolute top-3 left-3 z-10">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#FF6B00] bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FF6B00]/30 shadow-md">
                                            Community
                                        </span>
                                    </div> */}

                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                                        <h4 className="font-display text-lg text-white group-hover:text-[#FF6B00] transition-colors duration-300 mb-1 leading-tight">
                                            {img.title}
                                        </h4>
                                        {img.desc && (
                                            <p className="text-[11px] text-[#E0E0E0]/80 line-clamp-2 leading-relaxed">
                                                {img.desc}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Indicators */}
                        <div className="flex justify-center items-center mt-3 gap-2 sm:hidden">
                            {communityPhotos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToIndex(communityScrollRef, index, setCommunityIndex)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                                        communityIndex === index
                                            ? 'w-8 bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.5)]'
                                            : 'w-2 bg-white/20'
                                    }`}
                                    aria-label={`Go to Community slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Desktop View: Option 1 Masonry Mosaic Grid */}
                        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {communityPhotos.map((img, index) => {
                                const isFeature = index === 0;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPhoto(img)}
                                        className={`rounded-3xl overflow-hidden border border-white/10 bg-[#181818] relative group cursor-pointer shadow-xl hover:border-[#FF6B00]/60 transition-all duration-500 ${
                                            isFeature
                                                ? 'sm:col-span-2 sm:row-span-2 h-[480px] sm:h-[520px]'
                                                : 'h-[240px] sm:h-[248px]'
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />

                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6B00] bg-[#121212]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FF6B00]/30 shadow-md">
                                                Community
                                            </span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 pointer-events-none">
                                            <h4 className={`font-display uppercase text-white group-hover:text-[#FF6B00] transition-colors duration-300 mb-1 leading-tight ${isFeature ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
                                                {img.title}
                                            </h4>
                                            {img.desc && (
                                                <p className={`text-xs text-[#E0E0E0]/80 leading-relaxed ${isFeature ? 'line-clamp-3' : 'line-clamp-1'}`}>
                                                    {img.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>

            {/* Lightbox Image Preview Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedPhoto(null)}>
                    <div className="relative max-w-lg w-full bg-[#181818] rounded-3xl overflow-hidden border border-white/10 p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-[#FF6B00] hover:text-[#121212] transition-colors duration-300"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                        <div className="aspect-[4/5] relative overflow-hidden rounded-2xl">
                            <img src={selectedPhoto.url} alt={selectedPhoto.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent">
                                <h3 className="font-display text-xl sm:text-2xl text-white uppercase mb-1">{selectedPhoto.title}</h3>
                                <p className="text-xs sm:text-sm text-[#E0E0E0]/80">{selectedPhoto.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
