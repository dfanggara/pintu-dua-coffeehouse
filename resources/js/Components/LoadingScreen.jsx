import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        // Initial Visit Page Load Timer
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(() => setLoading(false), 500);
        }, 700);

        // Inertia Page Navigation Listeners
        const unbindStart = router.on('start', () => {
            setLoading(true);
            setFading(false);
        });

        const unbindFinish = router.on('finish', () => {
            setFading(true);
            setTimeout(() => setLoading(false), 400);
        });

        return () => {
            clearTimeout(timer);
            unbindStart();
            unbindFinish();
        };
    }, []);

    if (!loading && fading) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#121212] transition-all duration-500 ease-out ${
                fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            {/* Background Glow Overlay */}
            <div className="absolute w-80 h-80 bg-[#FF6B00]/20 rounded-full filter blur-3xl animate-pulse pointer-events-none" />

            {/* Glowing Logo Container */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                    <img
                        src="/images/logo.png"
                        alt="Pintu Dua Coffeehouse Loading"
                        className="h-20 sm:h-24 w-auto object-contain rounded-2xl shadow-[0_0_40px_rgba(255,107,0,0.5)] animate-bounce duration-1000"
                    />
                    {/* Ring Pulse Accent */}
                    <div className="absolute -inset-3 rounded-3xl border-2 border-[#FF6B00]/40 animate-ping pointer-events-none" />
                </div>

                {/* Brand Typography */}
                <span className="font-display text-2xl sm:text-3xl uppercase tracking-widest text-white mb-1">
                    PINTU DUA
                </span>
                <span className="text-xs font-bold uppercase text-[#FF6B00] tracking-[0.3em] mb-6">
                    Coffeehouse
                </span>

                {/* Neon Orange Loading Bar */}
                <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#ff944d] w-full animate-[loading-bar_1.2s_ease-in-out_infinite] glow-orange-sm rounded-full" />
                </div>
            </div>
        </div>
    );
}
