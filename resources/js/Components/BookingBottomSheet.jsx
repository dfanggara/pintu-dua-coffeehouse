import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
];

const PAX_OPTIONS = [
    { label: '1-2 Tamu', value: '2' },
    { label: '3-4 Tamu', value: '4' },
    { label: '5-6 Tamu', value: '6' },
    { label: '8+ Group', value: '8' },
];

const AREA_PREFERENCES = [
    'AC Indoor',
    'Indoor Smoking',
    'Outdoor Space',
    'Working Space',
];

export default function BookingBottomSheet({ isOpen, onClose }) {
    const [rendered, setRendered] = useState(false);
    const [active, setActive] = useState(false);
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [customNote, setCustomNote] = useState('');
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

    // Combine Area Preference Chips & Custom Textarea Note cleanly into formData.special_notes
    useEffect(() => {
        const areaText = selectedAreas.length > 0 ? `Area: ${selectedAreas.join(', ')}` : '';
        const fullNote = [areaText, customNote.trim()].filter(Boolean).join(' | ');
        setFormData(prev => ({ ...prev, special_notes: fullNote }));
    }, [selectedAreas, customNote]);

    if (!rendered) return null;

    const resetForm = () => {
        setFormData({
            customer_name: '',
            pax: '2',
            reservation_date: '',
            reservation_time: '',
            special_notes: '',
        });
        setSelectedAreas([]);
        setCustomNote('');
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

    const toggleAreaPreference = (area) => {
        setSelectedAreas(prev =>
            prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
        );
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
*Catatan / Area:* ${formData.special_notes || '-'}`;

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
*Catatan / Area:* ${formData.special_notes || '-'}`;

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
                className={`relative w-full max-w-lg bg-[#181818] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 transform transition-transform duration-300 ease-out z-10 max-h-[90vh] overflow-y-auto no-scrollbar ${
                    active ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
            >
                {/* Drag Handle Bar (Mobile) */}
                <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5 sm:hidden" />

                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="font-display text-2xl uppercase tracking-wider text-[#FF6B00]">
                            Table Reservation
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
                    {/* Full Name */}
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
                            placeholder="Nama Lengkap Anda"
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                        />
                    </div>

                    {/* Date & Time Input */}
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
                                    {formData.reservation_time ? `${formData.reservation_time} WIB` : 'Pilih Jam...'}
                                </span>
                                <span className={`material-symbols-outlined text-sm text-white/50 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180 text-[#FF6B00]' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {/* Scrollable Time Menu */}
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

                    {/* Quick Pax Selector Chips */}
                    <div>
                        <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Number of Guests (Pax)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {PAX_OPTIONS.map((opt) => {
                                const isSelected = formData.pax === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, pax: opt.value })}
                                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 border text-center ${
                                            isSelected
                                                ? 'bg-[#FF6B00] text-[#121212] border-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.3)]'
                                                : 'bg-[#121212] text-white/80 border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preferred Area Tag Chips (Optional) */}
                    <div>
                        <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Area Preference (Optional)
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {AREA_PREFERENCES.map((area) => {
                                const isSelected = selectedAreas.includes(area);
                                return (
                                    <button
                                        key={area}
                                        type="button"
                                        onClick={() => toggleAreaPreference(area)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 border ${
                                            isSelected
                                                ? 'bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/50'
                                                : 'bg-[#121212] text-[#E0E0E0]/60 border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        {isSelected ? `✓ ${area}` : `+ ${area}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Special Request / Custom Note */}
                    <div>
                        <label className="block font-bold text-xs text-[#E0E0E0]/80 mb-1.5 uppercase tracking-wider">
                            Catatan Tambahan (Optional)
                        </label>
                        <textarea
                            name="custom_note"
                            rows="2"
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder="Contoh: butuh stopkontak untuk laptop, bawa anak kecil..."
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-colors duration-300"
                        />
                    </div>

                    {/* Submit WhatsApp Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[#FF6B00] hover:bg-[#ff7b1a] text-[#121212] font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(255,107,0,0.3)] flex items-center justify-center gap-2.5 mt-2 disabled:opacity-50 active:scale-98"
                    >
                        {loading ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                <svg className="w-5 h-5 fill-[#121212]" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Lanjutkan ke WhatsApp</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
