import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
            {/* Background Glow Accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Center Box */}
            <div className="w-full max-w-md space-y-6 relative z-10">
                {/* Brand Header */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <Link href="/" className="group flex flex-col items-center transition-transform duration-300 hover:scale-105">
                        <div className="p-3 bg-[#181818] rounded-2xl border border-white/10 shadow-2xl glow-orange-sm mb-2">
                            <img
                                src="/images/logo.png"
                                alt="Pintu Dua Coffeehouse Logo"
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                        <h1 className="font-display text-3xl uppercase tracking-widest text-white leading-none">
                            PINTU DUA
                        </h1>
                        <span className="text-[10px] font-extrabold uppercase text-[#FF6B00] tracking-[0.25em] mt-1">
                            Coffeehouse & Urban Sanctuary
                        </span>
                    </Link>
                </div>

                {/* Card Form Wrapper */}
                <div className="bg-[#181818] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                    {children}
                </div>

                {/* Footer Back Link */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-[#E0E0E0]/60 hover:text-[#FF6B00] font-semibold transition-colors duration-200"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <span>Kembali ke Website Publik</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
