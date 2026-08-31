import React from 'react';
import { useBooking } from '@/Layouts/AppLayout';

export default function LocationHours({ onOpenBooking }) {
    const booking = useBooking();
    const handleBooking = onOpenBooking || booking.onOpenBooking;

    const mapsUrl = "https://maps.google.com/?q=Jl.+Manunggal+XVII+No.2,+Lubang+Buaya,+Cipayung,+Jakarta+Timur";

    const handleOpenMaps = () => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <section id="location" className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="section-accent" />
                <div>
                    <h3 className="section-title">
                        Visit & Hours
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-widest mt-0.5">
                        Location details & operational hours
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl overflow-hidden glass-card border border-white/10 p-2">
                {/* Left Card: Operational Hours & Location Details */}
                <div className="lg:col-span-5 bg-[#181818] p-6 sm:p-8 rounded-2xl flex flex-col justify-between border border-white/5 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#FF6B00] mb-4">
                            <span className="material-symbols-outlined text-xl">schedule</span>
                            <h4 className="font-bold text-xs uppercase tracking-wider">
                                Hours of Operation
                            </h4>
                        </div>

                        {/* Opening Hours Box */}
                        <div className="bg-[#121212] p-4 rounded-xl border border-white/10 mb-6">
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="font-bold text-xs uppercase text-white tracking-wider">Monday - Sunday</span>
                                <span className="text-xs font-black text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-md border border-[#FF6B00]/30">
                                    09.00 - 00.00
                                </span>
                            </div>
                            <p className="text-[11px] text-[#E0E0E0]/60 mt-2">
                                Buka Setiap Hari (Every Day) untuk Kopi, Smokehouse, & Outdoor Space.
                            </p>
                        </div>

                        {/* Address Box */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-lg text-[#FF6B00] shrink-0 mt-0.5">location_on</span>
                                <div className="text-xs text-[#E0E0E0]/90 leading-relaxed">
                                    <strong className="text-white block mb-0.5">Pintu Dua Coffeehouse</strong>
                                    Jl. Manunggal XVII No.2, RT.4/RW.11, Lubang Buaya, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13810
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#E0E0E0]/80">
                                <span className="material-symbols-outlined text-lg text-[#FF6B00] shrink-0">call</span>
                                <span>WhatsApp: <strong className="text-white">0812-8569-8689</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={handleOpenMaps}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
                        >
                            <span className="material-symbols-outlined text-base text-[#FF6B00]">map</span>
                            Open Google Maps
                        </button>

                        <button
                            onClick={handleBooking}
                            className="btn-pd-primary flex-1 justify-center"
                        >
                            <span className="material-symbols-outlined text-base">event_seat</span>
                            Book a Table
                        </button>
                    </div>
                </div>

                {/* Right Card: Interactive Embedded Maps & Clickable Direct Link */}
                <div
                    onClick={handleOpenMaps}
                    className="lg:col-span-7 bg-[#121212] rounded-2xl min-h-[340px] sm:min-h-[400px] relative overflow-hidden border border-white/10 cursor-pointer group"
                >
                    {/* Real Embedded Google Maps Iframe */}
                    <iframe
                        title="Pintu Dua Coffeehouse Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7336773956637!2d106.9038888!3d-6.2986111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f33b1e7c5b6b%3A0x6b4f7e2d9b6a123!2sJl.%20Manunggal%20XVII%20No.2%2C%20RT.4%2FRW.11%2C%20Lubang%20Buaya%2C%20Kec.%20Cipayung%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013810!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full pointer-events-none group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />

                    {/* Dark Glassmorphism Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/20 to-transparent pointer-events-none" />

                    {/* Top Right Floating Badge */}
                    <div className="absolute top-4 right-4 z-10 pointer-events-none">
                        <span className="flex items-center gap-1.5 bg-[#FF6B00] text-[#121212] font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]">
                            <span className="material-symbols-outlined text-sm">near_me</span>
                            Direct to Google Maps
                        </span>
                    </div>

                    {/* Bottom Overlay Info Card */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 bg-[#181818]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between pointer-events-none group-hover:border-[#FF6B00]/60 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] shrink-0">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                            </div>
                            <div>
                                <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                                    Pintu Dua Coffeehouse
                                </h5>
                                <p className="text-[11px] text-[#E0E0E0]/70 truncate max-w-[200px] sm:max-w-xs">
                                    Jl. Manunggal XVII No.2, Lubang Buaya
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                            Directions <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
