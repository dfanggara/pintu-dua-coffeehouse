import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookingBottomSheet({ isOpen, onClose }) {
    const [rendered, setRendered] = useState(false);
    const [active, setActive] = useState(false);
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

    if (!rendered) return null;

    const resetForm = () => {
        setFormData({
            customer_name: '',
            pax: '2',
            reservation_date: '',
            reservation_time: '',
            special_notes: '',
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
*Jam:* ${formData.reservation_time}
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
*Jam:* ${formData.reservation_time}
*Catatan:* ${formData.special_notes || '-'}`;

            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`, '_blank');
            resetForm();
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop with Blur & Fade Transition */}
            <div
                className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-out ${
                    active ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Bottom Sheet Container */}
            <div
                className={`bg-[#181818] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-white/10 border-t-4 border-t-[#FF6B00] transition-all duration-300 ease-out transform ${
                    active
                        ? 'translate-y-0 opacity-100 sm:scale-100'
                        : 'translate-y-full opacity-0 sm:scale-95'
                }`}
            >
                {/* Grab Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-pointer" onClick={handleClose}>
                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>

                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Pintu Dua Logo"
                                className="h-10 w-auto object-contain rounded-lg glow-orange-sm"
                            />
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00]">
                                    Reservation System
                                </span>
                                <h2 className="font-display text-2xl sm:text-3xl uppercase text-white leading-none">
                                    Book a Table
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E0E0E0]/70 hover:text-white hover:bg-white/10 transition-colors duration-300"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
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
                                placeholder="Masukkan nama Anda"
                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="reservation_date"
                                    required
                                    value={formData.reservation_date}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    name="reservation_time"
                                    required
                                    value={formData.reservation_time}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                                />
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
                                <option value="3-4">3 - 4 Persons</option>
                                <option value="5-6">5 - 6 Persons</option>
                                <option value="7+">7+ Persons (Group)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                                Special Notes (Optional)
                            </label>
                            <textarea
                                name="special_notes"
                                rows="2"
                                value={formData.special_notes}
                                onChange={handleChange}
                                placeholder="e.g.: indoor, indoor smoking, working space, rooftop..."
                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                            />
                        </div>

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-pd-wa w-full"
                            >
                                <span className="material-symbols-outlined text-xl">chat</span>
                                {loading ? 'continue to whatsapp...' : 'Continue to WhatsApp'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
