import React from 'react';
import { Link } from '@inertiajs/react';

export default function BottomNav({ onOpenBooking, currentRoute = 'home' }) {
    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="glass-card rounded-2xl p-2 px-6 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#121212]/90">
                <Link
                    href="/"
                    className={`flex flex-col items-center py-1 transition-colors duration-300 ${
                        currentRoute === 'home' ? 'text-[#FF6B00]' : 'text-[#E0E0E0]/70 hover:text-[#FF6B00]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">grid_view</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold mt-0.5">Home</span>
                </Link>

                <Link
                    href="/menu"
                    className={`flex flex-col items-center py-1 transition-colors duration-300 ${
                        currentRoute === 'menu' ? 'text-[#FF6B00]' : 'text-[#E0E0E0]/70 hover:text-[#FF6B00]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">restaurant_menu</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold mt-0.5">Menu</span>
                </Link>

                {/* Floating Action Button (FAB) */}
                <div className="relative -top-5">
                    <button
                        onClick={onOpenBooking}
                        className="bg-gradient-to-tr from-[#FF6B00] to-[#ff944d] text-[#121212] p-4 rounded-2xl glow-orange active:scale-90 transition-all duration-300 border-4 border-[#121212] flex items-center justify-center shadow-xl group hover:brightness-110"
                        aria-label="Book Table"
                    >
                        <span className="material-symbols-outlined text-2xl font-black group-hover:rotate-12 transition-transform duration-300">
                            event_seat
                        </span>
                    </button>
                </div>

                <Link
                    href="/gallery"
                    className={`flex flex-col items-center py-1 transition-colors duration-300 ${
                        currentRoute === 'gallery' ? 'text-[#FF6B00]' : 'text-[#E0E0E0]/70 hover:text-[#FF6B00]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">photo_library</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold mt-0.5">Gallery</span>
                </Link>

                <Link
                    href="/location"
                    className={`flex flex-col items-center py-1 transition-colors duration-300 ${
                        currentRoute === 'location' ? 'text-[#FF6B00]' : 'text-[#E0E0E0]/70 hover:text-[#FF6B00]'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl">near_me</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold mt-0.5">Location</span>
                </Link>
            </div>
        </div>
    );
}
