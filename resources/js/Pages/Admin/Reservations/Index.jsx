import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function ReservationsIndex({ reservations = {}, filters = {} }) {
    const items = Array.isArray(reservations) ? reservations : (reservations?.data || []);
    const paginationLinks = reservations?.links || [];
    const totalItems = reservations?.total ?? items.length;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPeriod, setSelectedPeriod] = useState(filters.period || '');
    const [selectedSort, setSelectedSort] = useState(filters.sort || 'latest');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const applyFilters = (overrides = {}) => {
        router.get(route('admin.reservations.index'), {
            search: overrides.search !== undefined ? overrides.search : searchTerm,
            status: overrides.status !== undefined ? overrides.status : selectedStatus,
            period: overrides.period !== undefined ? overrides.period : selectedPeriod,
            sort: overrides.sort !== undefined ? overrides.sort : selectedSort,
        }, { preserveState: true });
    };

    const handleFilterSubmit = (e) => {
        if (e) e.preventDefault();
        applyFilters();
    };

    const handleStatusFilterChange = (status) => {
        setSelectedStatus(status);
        applyFilters({ status });
    };

    const handlePeriodFilterChange = (period) => {
        setSelectedPeriod(period);
        applyFilters({ period });
    };

    const handleSortChange = (sort) => {
        setSelectedSort(sort);
        applyFilters({ sort });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedPeriod('');
        setSelectedSort('latest');
        router.get(route('admin.reservations.index'), {}, { preserveState: true });
    };

    const handleStatusChange = (bookingCode, newStatus) => {
        router.patch(route('admin.reservations.update-status', bookingCode), {
            status: newStatus,
        });
    };

    const handleDeleteReservation = (bookingCode) => {
        setDeleteTarget(bookingCode);
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
                            Kelola pemesanan meja pelanggan Pintu Dua Coffeehouse
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

            <div className="pt-6 sm:pt-8 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
                    {/* Mobile Quick Status Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:hidden pb-1">
                        {[
                            { id: '', label: 'Semua' },
                            { id: 'pending', label: '🟡 Pending' },
                            { id: 'confirmed', label: '🟢 Confirmed' },
                            { id: 'cancelled', label: '🔴 Cancelled' },
                        ].map((chip) => {
                            const isActive = selectedStatus === chip.id;
                            return (
                                <button
                                    key={chip.id}
                                    type="button"
                                    onClick={() => handleStatusFilterChange(chip.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border transition-all ${
                                        isActive
                                            ? 'bg-[#FF6B00] text-[#121212] border-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.4)]'
                                            : 'bg-[#181818] text-[#E0E0E0]/70 border-white/10'
                                    }`}
                                >
                                    {chip.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="bg-[#181818] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl space-y-3">
                        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            {/* Text Search Input */}
                            <div className="sm:col-span-3 relative">
                                <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#E0E0E0]/50 text-base">search</span>
                                <input
                                    type="text"
                                    placeholder="Cari nama, kode, catatan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-[#E0E0E0]/40 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                />
                            </div>

                            {/* Status Filter (Desktop Select) */}
                            <div className="hidden sm:block sm:col-span-2">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-medium"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">🟡 Pending (Menunggu)</option>
                                    <option value="confirmed">🟢 Confirmed (Disetujui)</option>
                                    <option value="cancelled">🔴 Cancelled (Batal)</option>
                                </select>
                            </div>

                            {/* Period Filter Dropdown */}
                            <div className="sm:col-span-3">
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => handlePeriodFilterChange(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-medium"
                                >
                                    <option value="">📅 Semua Periode Tanggal</option>
                                    <option value="today">⚡ Reservasi Hari Ini</option>
                                    <option value="tomorrow">⏭️ Reservasi Besok</option>
                                    <option value="this_month">🗓️ Bulan Ini</option>
                                    <option value="last_month">⏪ Bulan Lalu</option>
                                </select>
                            </div>

                            {/* Sorting Order Dropdown */}
                            <div className="sm:col-span-2">
                                <select
                                    value={selectedSort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#FF6B00] font-bold focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                >
                                    <option value="latest">🕒 Terbaru (Default)</option>
                                    <option value="oldest">⏳ Terlama</option>
                                    <option value="pax_desc">👥 Pax Terbanyak</option>
                                    <option value="pax_asc">👥 Pax Tersedikit</option>
                                    <option value="name_asc">👤 Nama A-Z</option>
                                </select>
                            </div>

                            {/* Filter Actions */}
                            <div className="sm:col-span-2 flex gap-1.5">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-[#FF6B00] text-[#121212] rounded-xl font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(255,107,0,0.25)]"
                                >
                                    Filter
                                </button>
                                {(searchTerm || selectedStatus || selectedPeriod || selectedSort !== 'latest') && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-colors"
                                        title="Reset Semua Filter"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Reservations Data Table & Mobile Cards */}
                    <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center bg-[#141414]">
                            <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                                Daftar Pemesanan Meja
                            </h3>
                            <span className="text-xs text-[#E0E0E0]/60">
                                Total {totalItems} data
                            </span>
                        </div>

                        {/* MOBILE VIEW: Touch-friendly Mobile Cards (sm:hidden) */}
                        <div className="block sm:hidden p-3.5 space-y-3.5">
                            {items.length === 0 ? (
                                <p className="p-6 text-center text-xs text-[#E0E0E0]/50 italic">
                                    Belum ada data reservasi yang sesuai filter.
                                </p>
                            ) : (
                                items.map((res) => (
                                    <div
                                        key={res.booking_code}
                                        className="bg-[#121212] p-4 rounded-2xl border border-white/10 space-y-3 shadow-md"
                                    >
                                        {/* Header: Booking Code & Status Pill */}
                                        <div className="flex justify-between items-center">
                                            <span className="bg-[#FF6B00]/15 text-[#FF6B00] text-xs font-mono font-black px-2.5 py-1 rounded-md border border-[#FF6B00]/30">
                                                {res.booking_code}
                                            </span>

                                            <div>
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
                                            </div>
                                        </div>

                                        {/* Customer Details */}
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#E0E0E0]/50 uppercase">Pemesan</p>
                                                <p className="font-bold text-white truncate">{res.customer_name}</p>
                                                <p className="text-[11px] text-[#FF6B00] font-bold">{res.pax} Orang</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-[#E0E0E0]/50 uppercase">Jadwal</p>
                                                <p className="font-bold text-white">{res.reservation_date}</p>
                                                <p className="text-[11px] text-[#E0E0E0]/80 font-semibold">{res.reservation_time} WIB</p>
                                            </div>
                                        </div>

                                        {/* Notes / Special Request */}
                                        {res.special_notes && (
                                            <div className="bg-[#181818] p-2.5 rounded-xl border border-white/5 text-[11px] text-[#E0E0E0]/80 leading-relaxed break-words overflow-hidden">
                                                <span className="text-[#FF6B00] font-bold">Catatan: </span>
                                                {res.special_notes}
                                            </div>
                                        )}

                                        {/* Mobile Action Buttons */}
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                            <button
                                                onClick={() => handleStatusChange(res.booking_code, 'confirmed')}
                                                className="flex-1 py-2 rounded-xl bg-emerald-600/80 active:bg-emerald-500 text-white text-xs font-bold transition-all text-center shadow-sm"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(res.booking_code, 'cancelled')}
                                                className="flex-1 py-2 rounded-xl bg-yellow-600/80 active:bg-yellow-500 text-white text-xs font-bold transition-all text-center shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReservation(res.booking_code)}
                                                className="py-2 px-3 rounded-xl bg-rose-600/80 active:bg-rose-500 text-white text-xs font-bold transition-all"
                                                title="Hapus Reservasi"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* DESKTOP VIEW: Data Table (hidden sm:block) */}
                        <div className="hidden sm:block overflow-x-auto">
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
                                                Belum ada data reservasi yang sesuai filter.
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
                                                <td className="p-4 font-semibold text-white">
                                                    {res.pax} orang
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{res.reservation_date}</div>
                                                    <div className="text-[#FF6B00] font-semibold">{res.reservation_time} WIB</div>
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

                        {/* Pagination Links */}
                        {paginationLinks.length > 3 && (
                            <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#141414]">
                                <div className="text-xs text-[#E0E0E0]/60">
                                    Menampilkan <span className="font-bold text-white">{reservations.from || 0}</span> - <span className="font-bold text-white">{reservations.to || 0}</span> dari <span className="font-bold text-[#FF6B00]">{reservations.total || 0}</span> reservasi
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                    {paginationLinks.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                link.active
                                                    ? 'bg-[#FF6B00] text-[#121212] shadow-[0_0_10px_rgba(255,107,0,0.4)]'
                                                    : link.url
                                                        ? 'bg-white/5 text-white hover:bg-white/15'
                                                        : 'text-white/30 cursor-not-allowed bg-white/5'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={Boolean(deleteTarget)}
                title="Hapus Data Reservasi"
                message={`Apakah Anda yakin ingin menghapus data reservasi (${deleteTarget}) ini secara permanen dari database?`}
                onConfirm={() => {
                    if (deleteTarget) {
                        router.delete(route('admin.reservations.destroy', deleteTarget));
                    }
                }}
                onClose={() => setDeleteTarget(null)}
            />
        </AuthenticatedLayout>
    );
}
