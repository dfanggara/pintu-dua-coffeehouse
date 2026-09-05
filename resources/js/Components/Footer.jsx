import React, { useState } from 'react';

export default function Footer() {
    const [clickCount, setClickCount] = useState(0);

    const handleSecretAdminTrigger = () => {
        setClickCount(prev => {
            const nextCount = prev + 1;
            if (nextCount >= 3) {
                window.location.href = '/login';
                return 0;
            }
            return nextCount;
        });

        // Reset click counter if not completed within 1.5 seconds
        setTimeout(() => {
            setClickCount(0);
        }, 1500);
    };

    return (
        <footer className="bg-[#0A0A0A] border-t border-white/10 pt-10 pb-28 md:pb-12 text-[#E0E0E0] relative overflow-hidden">
            {/* Watermark Logo Background Graphic */}
            <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-64 h-64 opacity-5 pointer-events-none select-none">
                <img src="/images/logo.png" alt="Watermark" className="w-full h-full object-contain filter grayscale" />
            </div>

            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                {/* Main 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
                    {/* Left Column: Brand Logo (Secret Triple-Click Trigger for Admin Access) */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                        <div
                            onClick={handleSecretAdminTrigger}
                            className="flex items-center gap-3.5 mb-4 cursor-pointer select-none group"
                            title="Pintu Dua Coffeehouse"
                        >
                            <img
                                src="/images/logo.png"
                                alt="Pintu Dua Coffeehouse Logo"
                                className="h-12 w-auto object-contain rounded-xl glow-orange-sm group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="flex flex-col">
                                <span className="font-display text-2xl uppercase tracking-wider text-white leading-none group-hover:text-[#FF6B00] transition-colors duration-300">
                                    PINTU DUA
                                </span>
                                <span className="text-[10px] font-bold uppercase text-[#FF6B00] tracking-[0.25em] leading-tight mt-0.5">
                                    Coffeehouse
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-[#E0E0E0]/60 max-w-xs leading-relaxed hidden md:block">
                            An urban sanctuary CRAFTING bold dark roasts, authentic connections, and the raw energy of the city.
                        </p>
                    </div>

                    {/* Center Column: Customer Center */}
                    <div className="md:col-span-4 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF6B00] mb-3">
                            Customer Center
                        </h4>
                        <a
                            href="https://maps.app.goo.gl/affmVDezm9E46XVm8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2.5 text-xs text-[#E0E0E0]/80 hover:text-white transition-colors group"
                        >
                            <span className="material-symbols-outlined text-base text-[#FF6B00] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">location_on</span>
                            <span className="group-hover:underline">Jl. Manunggal XVII No.2, RT.4/RW.11, Lubang Buaya, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13810</span>
                        </a>
                        <div className="flex items-center gap-2.5 text-xs text-[#E0E0E0]/80">
                            <span className="material-symbols-outlined text-base text-[#FF6B00] shrink-0">call</span>
                            <span className="font-semibold text-white">0812-8569-8689</span>
                        </div>
                    </div>

                    {/* Right Column: Follow Us & Social Media */}
                    <div className="md:col-span-4 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF6B00] mb-3">
                            Follow Us
                        </h4>
                        <p className="text-xs text-[#E0E0E0]/70 mb-3">
                            Stay connected with our latest offerings & exciting events on social media:
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Instagram Button */}
                            <a
                                href="https://www.instagram.com/pintuduacoffeehouse?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#E0E0E0]/80 hover:text-white hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10 transition-all duration-300 group"
                                aria-label="Instagram Pintu Dua"
                            >
                                <svg className="w-4 h-4 fill-[#FF6B00] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>

                            {/* TikTok Button */}
                            <a
                                href="https://www.tiktok.com/@coffeebytherooftop?_r=1&_t=ZS-99JtcAHkC1p"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#E0E0E0]/80 hover:text-white hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10 transition-all duration-300 group"
                                aria-label="TikTok Pintu Dua"
                            >
                                <svg className="w-4 h-4 fill-[#FF6B00] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                    <path d="M12.525 0h3.08c.12 1.05.7 2.05 1.58 2.76 1.07.86 2.45 1.34 3.81 1.37v3.29c-1.39-.04-2.75-.46-3.88-1.2v7.54c0 3.73-3.03 6.76-6.76 6.76s-6.76-3.03-6.76-6.76 3.03-6.76 6.76-6.76c.43 0 .86.04 1.28.12v3.28c-.42-.14-.87-.21-1.31-.21-1.92 0-3.48 1.56-3.48 3.48s1.56 3.48 3.48 3.48 3.48-1.56 3.48-3.48V0z"/>
                                </svg>
                            </a>

                            {/* WhatsApp Button */}
                            <a
                                href="https://wa.me/6281285698689"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#E0E0E0]/80 hover:text-white hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10 transition-all duration-300 group"
                                aria-label="WhatsApp Pintu Dua"
                            >
                                <svg className="w-4 h-4 fill-[#FF6B00] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright (Left) */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4 text-xs text-[#E0E0E0]/60">
                    <div>
                        © 2026 Pintu Dua Coffeehouse. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-[#FF6B00] transition-colors duration-300">Terms & Conditions</a>
                        <span>•</span>
                        <a href="#" className="hover:text-[#FF6B00] transition-colors duration-300">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
