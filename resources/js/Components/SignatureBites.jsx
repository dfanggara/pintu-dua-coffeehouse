import React, { useState } from 'react';
import MenuDetailModal from './MenuDetailModal';

export default function SignatureBites({ items = [] }) {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const displayItems = items.map(item => ({
        name: item.name,
        price: typeof item.price === 'number' ? `Rp ${item.price.toLocaleString('id-ID')}` : item.price,
        desc: item.description,
        img: item.image_url || '/images/espresso.png',
        isSignature: true,
    }));

    const handleOpenDetail = (item) => {
        setSelectedMenu(item);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
    };

    return (
        <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 mb-10 sm:mb-16">
            {/* Header Title with Subtitle & Hint */}
            <div className="flex justify-between items-end mb-6">
                <div className="flex items-center gap-3">
                    <div className="section-accent" />
                    <div>
                        <h3 className="section-title">
                            Signature Highlights
                        </h3>
                        {/* <p className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-widest mt-0.5">
                            Tier 1 Menu & Chef Specials
                        </p> */}
                    </div>
                </div>

                {/* Mobile Touch Swipe Hint Indicator */}
                {/* <div className="flex sm:hidden items-center gap-1.5 text-[10px] text-[#FF6B00] uppercase tracking-wider font-bold animate-pulse">
                    <span>Geser</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div> */}
            </div>

            {displayItems.length === 0 ? (
                <div className="glass-card rounded-2xl border border-white/10 p-12 text-center text-[#E0E0E0]/60 italic">
                    Belum ada menu signature highlight di database. Tambahkan menu baru dan centang "Signature Highlight" dari Admin Panel.
                </div>
            ) : (
                /* Combination of Option 1 (Horizontal Touch Swipe on Mobile) & Option 3 (90% Food Photo Focus) */
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 pb-2">
                    {displayItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleOpenDetail(item)}
                            className="w-[260px] sm:w-auto shrink-0 snap-center h-[320px] sm:h-[380px] rounded-3xl overflow-hidden border border-white/10 relative group cursor-pointer bg-[#181818] shadow-xl hover:border-[#FF6B00]/40 transition-all duration-300"
                        >
                            {/* 90% Full-bleed HD Food Photo */}
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Clean Bottom Vignette Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />

                            {/* Top Left Signature Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-[#121212]/80 backdrop-blur-md text-[#FF6B00] rounded-full border border-[#FF6B00]/30 shadow-md">
                                    Signature
                                </span>
                            </div>

                            {/* Top Right Price Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="font-black text-xs text-[#121212] bg-[#FF6B00] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(255,107,0,0.4)]">
                                    {item.price}
                                </span>
                            </div>

                            {/* Bottom Minimalist Title Content (No Text Crowding) */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
                                <h4 className="font-display text-2xl uppercase text-white group-hover:text-[#FF6B00] transition-colors duration-300 leading-tight">
                                    {item.name}
                                </h4>
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
        </section>
    );
}
