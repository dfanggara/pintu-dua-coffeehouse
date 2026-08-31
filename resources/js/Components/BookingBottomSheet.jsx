import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
];

export default function BookingBottomSheet({ isOpen, onClose }) {
    const [rendered, setRendered] = useState(false);
    const [active, setActive] = useState(false);
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
    const timeDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        pax: '2',
        reservation_date: '',
        reservation_time: '',
        special_notes: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRendered(true);
            const timer = setTimeout(() => setActive(true), 20);
            return () => clearTimeout(timer);
        } else {
            setActive(false);
            const timer = setTimeout(() => setRendered(false), 350);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Close custom dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target)) {
                setIsTimeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!rendered) return null;

    const resetForm = () => {
        setFormData({
            customer_name: '',
            pax: '2',
            reservation_date: '',
            reservation_time: '',
            special_notes: '',
        });
        setIsTimeDropdownOpen(false);
    };

    const handleClose = () => {
        setActive(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectTime = (slot) => {
        setFormData({ ...formData, reservation_time: slot });
        setIsTimeDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.reservation_time) {
            alert('Silakan pilih Jam Reservasi terlebih dahulu.');
            return;
        }

        setLoading(true);

        const waNumber = '6281285698689';

        try {
            const response = await axios.post('/api/reservations', formData);
            const bookingCode = response.data?.booking_code || 'RSV-PENDING';

            const messageText = `Halo Pintu Dua Coffeehouse, saya ingin konfirmasi reservasi:

*Kode Booking:* *${bookingCode}*
*Nama:* ${formData.customer_name}
*Jumlah Tamu:* ${formData.pax} orang
*Tanggal:* ${formData.reservation_date}
*Jam:* ${formData.reservation_time} WIB
*Catatan:* ${formData.special_notes || '-'}`;

            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`, '_blank');
            resetForm();
            handleClose();
        } catch (err) {
            console.error('Reservation Error:', err);
            const fallbackCode = `RSV-${Math.floor(1000 + Math.random() * 9000)}`;

            const messageText = `Halo Pintu Dua Coffeehouse, saya ingin konfirmasi reservasi:

*Kode Booking:* *${fallbackCode}*
*Nama:* ${formData.customer_name}
*Jumlah Tamu:* ${formData.pax} orang
*Tanggal:* ${formData.reservation_date}
*Jam:* ${formData.reservation_time} WIB
*Catatan:* ${formData.special_notes || '-'}`;

            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`, '_blank');
            resetForm();
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end sm:justify-center items-center">
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
                    active ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Bottom Sheet Card */}
            <div
                className={`relative w-full max-w-lg bg-[#181818] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-transform duration-300 ease-out z-10 ${
                    active ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
            >
                {/* Drag Handle Bar (Mobile) */}
                <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
                            Table Reservation
                        </span>
                        <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                            Reservation System
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            required
                            value={formData.customer_name}
                            onChange={handleChange}
                            placeholder="Your Full Name"
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Date Picker */}
                        <div>
                            <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                                Date
                            </label>
                            <input
                                type="date"
                                name="reservation_date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.reservation_date}
                                onChange={handleChange}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* Custom Sleek 24-Hour Time Dropdown */}
                        <div ref={timeDropdownRef} className="relative">
                            <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                                Time
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                className={`w-full bg-[#121212] border rounded-xl p-3 text-sm flex items-center justify-between transition-colors duration-200 ${
                                    isTimeDropdownOpen ? 'border-[#FF6B00] text-white ring-1 ring-[#FF6B00]' : 'border-white/10 text-white/90 hover:border-white/20'
                                }`}
                            >
                                <span className={formData.reservation_time ? 'font-bold text-white' : 'text-white/40'}>
                                    {formData.reservation_time ? `${formData.reservation_time} WIB` : 'Select Time...'}
                                </span>
                                <span className={`material-symbols-outlined text-sm text-white/50 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180 text-[#FF6B00]' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {/* Scrollable Popup Menu (Max 4.5 items visible ~160px height) */}
                            {isTimeDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#141414] border border-white/15 rounded-2xl shadow-2xl z-50 p-1.5 max-h-44 overflow-y-auto no-scrollbar grid grid-cols-2 gap-1 backdrop-blur-xl">
                                    {TIME_SLOTS.map((slot) => {
                                        const isSelected = formData.reservation_time === slot;
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => handleSelectTime(slot)}
                                                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-[#FF6B00] text-[#121212] font-black glow-orange-sm'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <span>{slot} WIB</span>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-xs">check</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Number of Guests (Pax)
                        </label>
                        <select
                            name="pax"
                            value={formData.pax}
                            onChange={handleChange}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                        >
                            <option value="1">1 Person</option>
                            <option value="2">2 Persons</option>
                            <option value="3">3 Persons</option>
                            <option value="4">4 Persons</option>
                            <option value="5">5 Persons</option>
                            <option value="6">6 Persons</option>
                            <option value="8">8 Persons (Group)</option>
                            <option value="10">10+ Persons (Event/Big Group)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Special Request (Optional)
                        </label>
                        <textarea
                            name="special_notes"
                            rows="2"
                            value={formData.special_notes}
                            onChange={handleChange}
                            placeholder="e.g. indoor, smoking indoor, working space, rooftop..."
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[#FF6B00] hover:bg-[#ff7b1a] text-[#121212] font-black text-sm uppercase tracking-wider transition-all duration-300 glow-orange transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                <span>Lanjutkan ke WhatsApp</span>
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
