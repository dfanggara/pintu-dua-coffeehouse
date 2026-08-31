import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar({ onOpenBooking, currentRoute = 'home' }) {
    const navLinks = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'menu', label: 'Menu', href: '/menu' },
        { id: 'gallery', label: 'Gallery', href: '/gallery' },
        { id: 'location', label: 'Location', href: '/location' },
    ];

    return (
        <nav className="w-full fixed top-0 left-0 right-0 glass-nav z-40 border-b border-white/10 shadow-lg">
            <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 sm:py-4">
                {/* Brand Official Logo */}
                <Link className="flex items-center gap-3 group shrink-0" href="/">
                    <img
                        src="/images/logo.png"
                        alt="Pintu Dua Coffeehouse Logo"
                        className="h-10 sm:h-12 w-auto object-contain rounded-xl glow-orange-sm group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="flex flex-col">
                        <span className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white group-hover:text-[#FF6B00] transition-colors duration-300 leading-none">
                            PINTU DUA
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#FF6B00] tracking-[0.25em] leading-tight mt-0.5">
                            Coffeehouse
                        </span>
                    </div>
                </Link>

                {/* Multi-Page Inertia SPA Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => {
                        const isActive = currentRoute === link.id;
                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`font-semibold text-xs tracking-widest uppercase transition-colors duration-300 relative py-1 group ${
                                    isActive ? 'text-[#FF6B00]' : 'text-[#E0E0E0]/80 hover:text-[#FF6B00]'
                                }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute bottom-0 left-0 h-0.5 bg-[#FF6B00] transition-all duration-300 ${
                                        isActive ? 'w-full glow-orange-sm' : 'w-0 group-hover:w-full'
                                    }`}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* Primary Reservation CTA Button */}
                <button
                    onClick={onOpenBooking}
                    className="hidden md:inline-flex btn-pd-primary shrink-0"
                >
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                    Book a Table
                </button>
            </div>
        </nav>
    );
}
