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
        <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-6">
                <div className="section-accent" />
                <div>
                    <h3 className="section-title">
                        Signature Highlights
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-widest mt-0.5">
                        Tier 1 Menu & Chef Specials
                    </p>
                </div>
            </div>

            {displayItems.length === 0 ? (
                <div className="glass-card rounded-2xl border border-white/10 p-12 text-center text-[#E0E0E0]/60 italic">
                    Belum ada menu signature highlight di database. Tambahkan menu baru dan centang "Signature Highlight" dari Admin Panel.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {displayItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleOpenDetail(item)}
                            className="h-[320px] sm:h-[360px] pd-card group relative cursor-pointer"
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                className="pd-card-img object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent pointer-events-none" />

                            {/* Price Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="font-black text-xs text-[#121212] bg-[#FF6B00] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(255,107,0,0.3)]">
                                    {item.price}
                                </span>
                            </div>

                            {/* Info Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
                                <h4 className="font-display text-2xl text-white group-hover:text-[#FF6B00] transition-colors duration-300 mb-1">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-[#E0E0E0]/80 line-clamp-2 leading-relaxed">
                                    {item.desc}
                                </p>
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
