import React, { useState, useEffect } from 'react';
import { useBooking } from '@/Layouts/AppLayout';

export default function MenuDetailModal({ item, isOpen, onClose }) {
    const [rendered, setRendered] = useState(false);
    const [active, setActive] = useState(false);
    const booking = useBooking();

    useEffect(() => {
        if (isOpen && item) {
            setRendered(true);
            const timer = setTimeout(() => setActive(true), 20);
            return () => clearTimeout(timer);
        } else {
            setActive(false);
            const timer = setTimeout(() => setRendered(false), 350);
            return () => clearTimeout(timer);
        }
    }, [isOpen, item]);

    if (!rendered || !item) return null;

    const handleClose = () => {
        setActive(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleBookTable = () => {
        handleClose();
        setTimeout(() => {
            if (booking?.onOpenBooking) {
                booking.onOpenBooking();
            }
        }, 350);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Dark Blur Backdrop */}
            <div
                className={`absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300 ease-out ${
                    active ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Modal Dialog Box */}
            <div
                className={`bg-[#181818] w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-white/10 border-t-4 border-t-[#FF6B00] transition-all duration-300 ease-out transform ${
                    active
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-colors duration-300"
                    aria-label="Close detail"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                    {/* Left Column: High-Res Product Shot */}
                    <div className="md:col-span-6 h-64 md:h-full min-h-[260px] md:min-h-[380px] relative overflow-hidden bg-[#121212]">
                        <img
                            src={item.img || item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent md:hidden pointer-events-none" />

                        {item.isSignature && (
                            <div className="absolute top-4 left-4 z-10">
                                <span className="text-[10px] font-black uppercase px-3 py-1 bg-[#FF6B00] text-[#121212] rounded-full shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                                    Pintu Dua Signature
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Menu Detail Information */}
                    <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B00] block mb-1">
                                Menu Item Detail
                            </span>
                            <h2 className="font-display text-3xl sm:text-4xl uppercase text-white mb-2 leading-none">
                                {item.name}
                            </h2>
                            <p className="font-black text-xl sm:text-2xl text-[#FF6B00] mb-4">
                                {item.price}
                            </p>
                            <p className="text-xs sm:text-sm text-[#E0E0E0]/80 leading-relaxed">
                                {item.note || item.desc || item.description || 'Nikmati kelezatan racikan kopi & sajian istimewa khas Pintu Dua Coffeehouse.'}
                            </p>
                        </div>

                        {/* Order & Reservation CTA Button */}
                        <div className="pt-2 border-t border-white/10">
                            <button
                                onClick={handleBookTable}
                                className="btn-pd-primary w-full"
                            >
                                <span className="material-symbols-outlined text-base">event_seat</span>
                                Book a Table for this Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
