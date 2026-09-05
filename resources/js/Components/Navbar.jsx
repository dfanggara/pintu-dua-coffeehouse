import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar({ onOpenBooking, currentRoute = 'home' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { id: 'home', label: 'Home', href: '/', icon: 'home' },
        { id: 'menu', label: 'Menu', href: '/menu', icon: 'restaurant_menu' },
        { id: 'gallery', label: 'Gallery', href: '/gallery', icon: 'photo_library' },
        { id: 'location', label: 'Location', href: '/location', icon: 'location_on' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="w-full fixed top-0 left-0 right-0 glass-nav z-40 border-b border-white/10 shadow-lg">
                <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
                    {/* Brand Official Logo */}
                    <Link className="flex items-center gap-3 group shrink-0" href="/">
                        <img
                            src="/images/logo.png"
                            alt="Pintu Dua Coffeehouse Logo"
                            className="h-9 sm:h-12 w-auto object-contain rounded-xl glow-orange-sm group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="flex flex-col">
                            <span className="font-display text-lg sm:text-2xl uppercase tracking-wider text-white group-hover:text-[#FF6B00] transition-colors duration-300 leading-none">
                                PINTU DUA
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[#FF6B00] tracking-[0.2em] leading-tight mt-0.5">
                                Coffeehouse
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
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

                    {/* Desktop Primary Reservation Button */}
                    <button
                        onClick={onOpenBooking}
                        className="hidden md:inline-flex btn-pd-primary shrink-0"
                    >
                        <span className="material-symbols-outlined text-base">calendar_month</span>
                        Reservation
                    </button>

                    {/* Mobile Top-Right Navigation Trigger Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#FF6B00] hover:border-[#FF6B00]/40 transition-all duration-300"
                        aria-label="Toggle navigation menu"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Full Drawer / Modal Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#121212]/95 backdrop-blur-xl transition-all duration-300">
                    {/* Drawer Header */}
                    <div className="flex justify-between items-center px-4 py-4 border-b border-white/10">
                        <Link onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3" href="/">
                            <img
                                src="/images/logo.png"
                                alt="Pintu Dua Coffeehouse Logo"
                                className="h-9 w-auto object-contain rounded-xl"
                            />
                            <div className="flex flex-col">
                                <span className="font-display text-lg uppercase tracking-wider text-white">
                                    PINTU DUA
                                </span>
                                <span className="text-[9px] font-bold uppercase text-[#FF6B00] tracking-widest">
                                    Coffeehouse
                                </span>
                            </div>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-full bg-white/10 border border-white/10 text-white"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Drawer Navigation Links */}
                    <div className="flex-1 px-6 py-8 flex flex-col justify-between space-y-6 overflow-y-auto">
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF6B00] block mb-2">
                                Navigation Menu
                            </span>
                            {navLinks.map(link => {
                                const isActive = currentRoute === link.id;
                                return (
                                    <Link
                                        key={link.id}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-start px-5 p-3.5 rounded-2xl border transition-all duration-300 ${
                                            isActive
                                                ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-[#FF6B00] font-bold'
                                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-sm font-bold uppercase tracking-widest text-left">
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Booking CTA Button inside Drawer */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (onOpenBooking) onOpenBooking();
                                }}
                                className="btn-pd-primary w-full justify-center py-3.5 tracking-widest font-black uppercase"
                            >
                                Reservation
                            </button>
                            <p className="text-[10px] text-center text-[#E0E0E0]/50 uppercase tracking-widest">
                                Open Daily 09.00 - 00.00 WIB
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
