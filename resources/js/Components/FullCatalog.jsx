import React, { useState, useEffect } from 'react';
import MenuDetailModal from './MenuDetailModal';

export default function FullCatalog({ categories = [] }) {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeCategorySlug, setActiveCategorySlug] = useState('');

    // Format categories & items
    const categoryGroups = (categories || []).map(cat => {
        const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
        const items = (cat.menus || []).map(m => ({
            name: m.name,
            note: m.description,
            price: typeof m.price === 'number' ? `Rp ${m.price.toLocaleString('id-ID')}` : m.price,
            isSignature: Boolean(m.is_highlight),
            img: m.image_url || '/images/espresso.png',
            categoryName: cat.name,
        }));

        return {
            id: slug,
            name: cat.name,
            items: items,
        };
    }).filter(group => group.items.length > 0);

    // Set initial active category
    useEffect(() => {
        if (categoryGroups.length > 0 && !activeCategorySlug) {
            setActiveCategorySlug(categoryGroups[0].id);
        }
    }, [categoryGroups]);

    const scrollToCategory = (slug) => {
        setActiveCategorySlug(slug);
        const el = document.getElementById(`cat-section-${slug}`);
        if (el) {
            const yOffset = -105; // Offset for main navbar + sticky category bar
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleOpenDetail = (item) => {
        setSelectedMenu(item);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
    };

    return (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 pb-2 sm:pb-6 mb-12 sm:mb-16">
            {/* FORE Style Category Bar (Fixed Directly Below Navbar with Perfect Clearance) */}
            {categoryGroups.length > 0 && (
                <div className="fixed top-[64px] sm:top-[76px] left-0 right-0 z-30 bg-[#121212] py-3.5 border-b border-white/10 shadow-2xl">
                    <div className="max-w-screen-2xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 md:px-8">
                        {categoryGroups.map(group => {
                            const isActive = activeCategorySlug === group.id;
                            return (
                                <button
                                    key={group.id}
                                    id={`cat-tab-${group.id}`}
                                    onClick={() => scrollToCategory(group.id)}
                                    className={`text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-300 whitespace-nowrap shrink-0 py-1 border-b-2 ${
                                        isActive
                                            ? 'text-[#FF6B00] border-[#FF6B00] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 border-transparent hover:text-white'
                                    }`}
                                >
                                    {group.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Continuous Category Scroll Sections */}
            {categoryGroups.length === 0 ? (
                <div className="glass-card rounded-2xl border border-white/10 p-12 text-center text-[#E0E0E0]/60 italic">
                    Belum ada menu di database. Silakan tambahkan menu dari Admin Panel.
                </div>
            ) : (
                <div className="space-y-10 sm:space-y-16">
                    {categoryGroups.map((group, gIdx) => (
                        <div
                            key={gIdx}
                            id={`cat-section-${group.id}`}
                            className="space-y-4 sm:space-y-6 scroll-mt-36"
                        >
                            {/* Category Header Title */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="w-1.5 h-6 bg-[#FF6B00] rounded-full glow-orange-sm" />
                                <h4 className="font-display text-xl sm:text-3xl uppercase tracking-wider font-bold text-white">
                                    {group.name}
                                </h4>
                            </div>

                            {/* MOBILE VIEW: FORE Coffee Horizontal Row List (Mobile Only: sm:hidden) */}
                            <div className="space-y-3.5 block sm:hidden">
                                {group.items.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleOpenDetail(item)}
                                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#181818] border border-white/10 active:scale-98 transition-all duration-300 cursor-pointer shadow-md hover:border-[#FF6B00]/50"
                                    >
                                        {/* Left Square Thumbnail Photo */}
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#121212] border border-white/10 relative">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {item.isSignature && (
                                                <span className="absolute top-1 left-1 text-[8px] font-black uppercase px-1.5 py-0.5 bg-[#FF6B00] text-[#121212] rounded">
                                                    Sig
                                                </span>
                                            )}
                                        </div>

                                        {/* Right Content Details */}
                                        <div className="flex-1 min-w-0 pr-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h5 className="font-bold text-sm text-white truncate leading-tight">
                                                    {item.name}
                                                </h5>
                                            </div>
                                            <p className="text-xs font-bold text-[#FF6B00] my-1">
                                                {item.price}
                                            </p>
                                            {item.note && (
                                                <p className="text-[11px] text-[#E0E0E0]/70 line-clamp-2 leading-relaxed font-light">
                                                    {item.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP VIEW: Premium Visual Photo Cards Grid (Desktop Only: hidden sm:grid) */}
                            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {group.items.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleOpenDetail(item)}
                                        className="h-[340px] rounded-3xl overflow-hidden border border-white/10 relative group cursor-pointer bg-[#181818] shadow-xl hover:border-[#FF6B00]/40 transition-all duration-300"
                                    >
                                        {/* Full-bleed HD Food Photo */}
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                        />

                                        {/* Dark Bottom Vignette Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />

                                        {/* Top Left Signature Badge */}
                                        {item.isSignature && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-[#121212]/80 backdrop-blur-md text-[#FF6B00] rounded-full border border-[#FF6B00]/30 shadow-md">
                                                    Signature
                                                </span>
                                            </div>
                                        )}

                                        {/* Top Right Price Badge */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="font-black text-xs text-[#121212] bg-[#FF6B00] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(255,107,0,0.4)]">
                                                {item.price}
                                            </span>
                                        </div>

                                        {/* Bottom Content: Title & Description Preview */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
                                            <h4 className="font-display text-2xl uppercase text-white group-hover:text-[#FF6B00] transition-colors duration-300 leading-tight mb-1">
                                                {item.name}
                                            </h4>
                                            {item.note && (
                                                <p className="text-xs text-[#E0E0E0]/80 line-clamp-1 font-light leading-relaxed">
                                                    {item.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Menu Detail Popup Modal */}
            <MenuDetailModal
                item={selectedMenu}
                isOpen={isDetailOpen}
                onClose={handleCloseDetail}
            />
        </div>
    );
}
