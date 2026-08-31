import React, { useState } from 'react';
import MenuDetailModal from './MenuDetailModal';

export default function FullCatalog({ categories = [] }) {
    const [activeTab, setActiveTab] = useState('our-signature');
    const [openCategory, setOpenCategory] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const signatureList = [];
    const drinkCats = [];
    const foodCats = [];

    (categories || []).forEach(cat => {
        const allItems = [];

        (cat.menus || []).forEach(m => {
            const itemObj = {
                name: m.name,
                note: m.description,
                price: typeof m.price === 'number' ? `Rp ${m.price.toLocaleString('id-ID')}` : m.price,
                isSignature: Boolean(m.is_highlight),
                img: m.image_url || '/images/espresso.png',
            };
            allItems.push(itemObj);
            if (m.is_highlight) signatureList.push(itemObj);
        });

        const catGroup = {
            category: cat.name,
            items: allItems,
        };

        const isFood = cat.type === 'food' || ['main-course', 'bites-snacks', 'food'].includes(cat.slug);

        if (isFood) {
            foodCats.push(catGroup);
        } else {
            drinkCats.push(catGroup);
        }
    });

    const menuData = {
        'our-signature': signatureList,
        drink: drinkCats,
        food: foodCats,
    };

    const currentAccordionList = menuData[activeTab] || [];
    const activeOpenCategory = openCategory || (currentAccordionList[0]?.category ?? '');

    const toggleAccordion = (cat) => {
        setOpenCategory(openCategory === cat ? null : cat);
    };

    const handleOpenDetail = (item) => {
        setSelectedMenu(item);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
    };

    return (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 mb-12 sm:mb-16">
            {/* Header & Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="section-accent" />
                    <div>
                        <h3 className="section-title">
                            Pintu Dua Coffee Menu
                        </h3>
                        <p className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-widest mt-0.5">
                            {activeTab === 'our-signature' ? 'Featured Chef Specials & Signature Highlights' : 'Interactive Accordion Catalog'}
                        </p>
                    </div>
                </div>

                <div className="bg-[#1C1C1C] p-1 rounded-2xl flex items-center gap-1 border border-white/10 self-start sm:self-auto shadow-inner overflow-x-auto max-w-full">
                    <button
                        onClick={() => {
                            setActiveTab('our-signature');
                            setOpenCategory(null);
                        }}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                            activeTab === 'our-signature'
                                ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm shadow-md'
                                : 'text-[#E0E0E0]/70 hover:text-white'
                        }`}
                    >
                        Our Signature ({signatureList.length})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('drink');
                            setOpenCategory(null);
                        }}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                            activeTab === 'drink'
                                ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm shadow-md'
                                : 'text-[#E0E0E0]/70 hover:text-white'
                        }`}
                    >
                        Drink ({drinkCats.reduce((acc, c) => acc + c.items.length, 0)})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('food');
                            setOpenCategory(null);
                        }}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                            activeTab === 'food'
                                ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm shadow-md'
                                : 'text-[#E0E0E0]/70 hover:text-white'
                        }`}
                    >
                        Food ({foodCats.reduce((acc, c) => acc + c.items.length, 0)})
                    </button>
                </div>
            </div>

            {/* TAB CONTENT 1: Our Signature - Direct Visual Photo Cards Display */}
            {activeTab === 'our-signature' ? (
                signatureList.length === 0 ? (
                    <div className="p-12 text-center text-[#E0E0E0]/60 italic glass-card rounded-2xl border border-white/10">
                        Belum ada menu Signature Highlight di database. Silakan tambahkan menu dan centang "Signature Highlight" dari Admin Panel.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {signatureList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleOpenDetail(item)}
                                className="h-[340px] sm:h-[380px] pd-card group relative cursor-pointer"
                            >
                                {/* Background Image with Zoom */}
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="pd-card-img object-cover w-full h-full"
                                />
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent pointer-events-none" />

                                {/* Top Badge */}
                                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
                                    <span className="text-[9px] font-black uppercase px-3 py-1 bg-[#FF6B00]/90 text-[#121212] rounded-full shadow-[0_0_12px_rgba(255,107,0,0.3)]">
                                        Signature
                                    </span>
                                    <span className="font-black text-xs text-[#121212] bg-[#FF6B00] px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(255,107,0,0.3)]">
                                        {item.price}
                                    </span>
                                </div>

                                {/* Bottom Info Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 pointer-events-none">
                                    <h4 className="font-display text-2xl sm:text-3xl text-white group-hover:text-[#FF6B00] transition-colors duration-300 mb-1.5 leading-tight">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-[#E0E0E0]/80 line-clamp-2 leading-relaxed">
                                        {item.note}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                /* TAB CONTENT 2 & 3: Drink & Food - Accordion Catalog Grid with Thumbnails */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {currentAccordionList.length === 0 ? (
                        <div className="col-span-2 p-12 text-center text-[#E0E0E0]/60 italic glass-card rounded-2xl border border-white/10">
                            Belum ada item menu untuk tab ini di database. Tambahkan menu via Admin Panel.
                        </div>
                    ) : (
                        currentAccordionList.map((catGroup, idx) => {
                            const isOpen = activeOpenCategory === catGroup.category;

                            return (
                                <div
                                    key={idx}
                                    className={`rounded-2xl glass-card border transition-all duration-300 ${
                                        isOpen ? 'border-[#FF6B00]/60 shadow-[0_0_20px_rgba(255,107,0,0.15)]' : 'border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <button
                                        onClick={() => toggleAccordion(catGroup.category)}
                                        className="w-full flex justify-between items-center p-4 sm:p-5 text-left focus:outline-none group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-5 sm:h-6 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#FF6B00] glow-orange-sm' : 'bg-white/20'}`} />
                                            <span className="font-bold text-sm sm:text-base text-white uppercase tracking-wider group-hover:text-[#FF6B00] transition-colors duration-300">
                                                {catGroup.category} ({catGroup.items.length})
                                            </span>
                                        </div>
                                        <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${isOpen ? 'text-[#FF6B00] rotate-180' : 'text-[#E0E0E0]/50'}`}>
                                            keyboard_arrow_down
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-white/5">
                                            {catGroup.items.length === 0 ? (
                                                <p className="text-xs text-[#E0E0E0]/50 italic p-3 text-center">
                                                    Belum ada menu di kategori ini.
                                                </p>
                                            ) : (
                                                <ul className="space-y-3 pt-2">
                                                    {catGroup.items.map((item, itemIdx) => (
                                                        <li
                                                            key={itemIdx}
                                                            onClick={() => handleOpenDetail(item)}
                                                            className="flex items-center justify-between gap-3 sm:gap-4 pt-2 border-b border-white/5 pb-2.5 group cursor-pointer hover:border-[#FF6B00]/40 transition-colors duration-300"
                                                        >
                                                            {/* Left Thumbnail Photo */}
                                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-[#121212] group-hover:border-[#FF6B00]/50 transition-colors duration-300">
                                                                <img
                                                                    src={item.img}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                />
                                                            </div>

                                                            {/* Item Title & Description */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <p className={`font-semibold text-xs sm:text-sm truncate transition-colors duration-300 ${item.isSignature ? 'text-[#FF6B00]' : 'text-white group-hover:text-[#FF6B00]'}`}>
                                                                        {item.name}
                                                                    </p>
                                                                    {item.isSignature && (
                                                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FF6B00]/20 text-[#FF6B00] rounded border border-[#FF6B00]/40 shrink-0">
                                                                            Signature
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {item.note && (
                                                                    <p className="text-[11px] sm:text-xs text-[#E0E0E0]/60 mt-0.5 leading-relaxed line-clamp-1">{item.note}</p>
                                                                )}
                                                            </div>

                                                            {/* Price Badge */}
                                                            <span className={`font-bold text-xs tracking-wider whitespace-nowrap px-3 py-1.5 rounded-xl shrink-0 transition-all duration-300 ${
                                                                item.isSignature
                                                                    ? 'bg-[#FF6B00] text-[#121212] font-black shadow-[0_0_10px_rgba(255,107,0,0.3)]'
                                                                    : 'bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 font-bold group-hover:bg-[#FF6B00] group-hover:text-[#121212] group-hover:border-transparent'
                                                            }`}>
                                                                {item.price}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
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
