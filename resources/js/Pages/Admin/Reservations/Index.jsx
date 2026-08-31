import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ReservationsIndex({ reservations = {}, filters = {} }) {
    const items = Array.isArray(reservations) ? reservations : (reservations?.data || []);
    const paginationLinks = reservations?.links || [];
    const totalItems = reservations?.total ?? items.length;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.reservations.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleStatusChange = (bookingCode, newStatus) => {
        router.patch(route('admin.reservations.update-status', bookingCode), {
            status: newStatus,
        });
    };

    const handleDeleteReservation = (bookingCode) => {
        if (confirm(`Apakah Anda yakin ingin menghapus reservasi ${bookingCode}?`)) {
            router.delete(route('admin.reservations.destroy', bookingCode));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Reservations Management
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Kelola daftar pemesanan meja pelanggan Pintu Dua Coffeehouse
                        </p>
                    </div>

                    <Link
                        href={route('admin.menus.index')}
                        className="px-4 py-2 rounded-xl bg-[#FF6B00] text-[#121212] font-bold text-xs uppercase tracking-wider glow-orange-sm hover:scale-105 transition-transform duration-300"
                    >
                        Kelola Katalog Menu &rarr;
                    </Link>
                </div>
            }
        >
            <Head title="Admin Reservations | Pintu Dua" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search & Counter Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        <form onSubmit={handleSearch} className="lg:col-span-6 flex gap-2">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#E0E0E0]/50 text-xl">search</span>
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama, kode booking, atau tanggal..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#181818] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-[#E0E0E0]/40 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-[#FF6B00] text-[#121212] rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
                            >
                                Cari
                            </button>
                        </form>

                        <div className="lg:col-span-6 grid grid-cols-3 gap-3">
                            <div className="bg-[#181818] p-3 rounded-xl border border-white/10 text-center">
                                <p className="text-[10px] font-semibold text-[#E0E0E0]/60 uppercase">Total Data</p>
                                <p className="text-xl font-black text-white">{totalItems}</p>
                            </div>
                            <div className="bg-[#181818] p-3 rounded-xl border border-white/10 text-center">
                                <p className="text-[10px] font-semibold text-yellow-400 uppercase">Pending</p>
                                <p className="text-xl font-black text-yellow-400">
                                    {items.filter(r => r.status === 'pending').length}
                                </p>
                            </div>
                            <div className="bg-[#181818] p-3 rounded-xl border border-white/10 text-center">
                                <p className="text-[10px] font-semibold text-emerald-400 uppercase">Confirmed</p>
                                <p className="text-xl font-black text-emerald-400">
                                    {items.filter(r => r.status === 'confirmed').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reservations Data Table */}
                    <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                Daftar Masuk Reservasi
                            </h3>
                            <span className="text-xs text-[#E0E0E0]/60">
                                Menampilkan {items.length} dari total {totalItems} data
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-[#E0E0E0]">
                                <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                    <tr>
                                        <th className="p-4">Kode Booking</th>
                                        <th className="p-4">Nama Pemesan</th>
                                        <th className="p-4">Tamu (Pax)</th>
                                        <th className="p-4">Tanggal & Jam</th>
                                        <th className="p-4">Catatan</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Aksi Konfirmasi & Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                Belum ada data reservasi yang sesuai.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((res) => (
                                            <tr key={res.booking_code} className="hover:bg-white/5 transition-colors duration-200">
                                                <td className="p-4 font-black text-white">
                                                    <span className="bg-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-1 rounded-md border border-[#FF6B00]/30 font-mono">
                                                        {res.booking_code}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-white">
                                                    {res.customer_name}
                                                </td>
                                                <td className="p-4">
                                                    {res.pax} orang
                                                </td>
                                                <td className="p-4">
                                                    <div>{res.reservation_date}</div>
                                                    <div className="text-[#FF6B00] font-semibold">{res.reservation_time}</div>
                                                </td>
                                                <td className="p-4 max-w-xs truncate text-[#E0E0E0]/70">
                                                    {res.special_notes || '-'}
                                                </td>
                                                <td className="p-4">
                                                    {res.status === 'confirmed' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                                            Confirmed
                                                        </span>
                                                    )}
                                                    {res.status === 'pending' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {res.status === 'cancelled' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                                            Cancelled
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => handleStatusChange(res.booking_code, 'confirmed')}
                                                            className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all duration-200"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(res.booking_code, 'cancelled')}
                                                            className="px-2.5 py-1 rounded-lg bg-yellow-600/80 hover:bg-yellow-500 text-white text-[11px] font-bold transition-all duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReservation(res.booking_code)}
                                                            className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-[11px] font-bold transition-all duration-200"
                                                            title="Hapus (Soft Delete)"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        {paginationLinks.length > 3 && (
                            <div className="p-4 border-t border-white/10 flex justify-center items-center gap-1.5">
                                {paginationLinks.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-[#FF6B00] text-[#121212]'
                                                : link.url
                                                    ? 'bg-white/5 text-white hover:bg-white/10'
                                                    : 'text-white/30 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
