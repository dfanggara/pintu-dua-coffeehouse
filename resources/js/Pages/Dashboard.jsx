import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats = {}, latestReservations = [] }) {
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
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white flex items-center gap-2">
                            <span>Admin Overview Dashboard</span>
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Ringkasan performa dan pemesanan meja Pintu Dua Coffeehouse
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.reservations.index')}
                            className="px-4 py-2 rounded-xl bg-[#FF6B00] text-[#121212] font-bold text-xs uppercase tracking-wider glow-orange-sm hover:scale-105 transition-transform duration-300"
                        >
                            Kelola Reservasi &rarr;
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin | Pintu Dua" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-xs font-semibold text-[#E0E0E0]/60 uppercase tracking-wider">
                                    Reservasi Hari Ini
                                </p>
                                <p className="text-3xl font-black text-white mt-1">
                                    {stats.total_reservations_today ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
                                <span className="material-symbols-outlined text-2xl">today</span>
                            </div>
                        </div>

                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-xs font-semibold text-yellow-400/80 uppercase tracking-wider">
                                    Status Pending
                                </p>
                                <p className="text-3xl font-black text-yellow-400 mt-1">
                                    {stats.pending_reservations ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                                <span className="material-symbols-outlined text-2xl">pending_actions</span>
                            </div>
                        </div>

                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">
                                    Status Confirmed
                                </p>
                                <p className="text-3xl font-black text-emerald-400 mt-1">
                                    {stats.confirmed_reservations ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                            </div>
                        </div>

                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
                            <div>
                                <p className="text-xs font-semibold text-[#E0E0E0]/60 uppercase tracking-wider">
                                    Menu Aktif
                                </p>
                                <p className="text-3xl font-black text-white mt-1">
                                    {stats.active_menus ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Navigation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Link
                            href={route('admin.menus.index')}
                            className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/50 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">Katalog Menu</span>
                                    <span className="material-symbols-outlined text-xl text-white/40 group-hover:text-[#FF6B00] transition-colors">arrow_forward</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Manajemen Menu & Kategori</h3>
                                <p className="text-xs text-[#E0E0E0]/60">Tambah, ubah harga, upload foto menu, dan kelola kategori.</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-bold text-[#E0E0E0]/80">
                                {stats.active_menus ?? 0} Menu Aktif &bull; {stats.inactive_menus ?? 0} Non-Aktif
                            </div>
                        </Link>

                        <Link
                            href={route('admin.hero-banners.index')}
                            className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/50 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">Hero Banners</span>
                                    <span className="material-symbols-outlined text-xl text-white/40 group-hover:text-[#FF6B00] transition-colors">arrow_forward</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Banner Slide Front-Page</h3>
                                <p className="text-xs text-[#E0E0E0]/60">Atur promo, foto slide utama, dan tombol Call-To-Action.</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-bold text-[#E0E0E0]/80">
                                Kelola Carousel Beranda
                            </div>
                        </Link>

                        <Link
                            href={route('admin.galleries.index')}
                            className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/50 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">Galeri Foto</span>
                                    <span className="material-symbols-outlined text-xl text-white/40 group-hover:text-[#FF6B00] transition-colors">arrow_forward</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Komunitas & Atmosphere</h3>
                                <p className="text-xs text-[#E0E0E0]/60">Upload foto kebersamaan komunitas, barista, dan interior cafe.</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-bold text-[#E0E0E0]/80">
                                {stats.total_galleries ?? 0} Foto Terpublikasi
                            </div>
                        </Link>
                    </div>

                    {/* Latest 5 Reservations Table */}
                    <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                    Reservasi Terbaru Masuk
                                </h3>
                                <p className="text-[11px] text-[#E0E0E0]/60">5 pemesanan meja paling akhir</p>
                            </div>

                            <Link
                                href={route('admin.reservations.index')}
                                className="text-xs text-[#FF6B00] font-bold hover:underline"
                            >
                                Lihat Semua Reservasi &rarr;
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-[#E0E0E0]">
                                <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                    <tr>
                                        <th className="p-4">Kode Booking</th>
                                        <th className="p-4">Nama Pemesan</th>
                                        <th className="p-4">Tamu</th>
                                        <th className="p-4">Tanggal & Jam</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Aksi Konfirmasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {latestReservations.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                Belum ada reservasi terbaru.
                                            </td>
                                        </tr>
                                    ) : (
                                        latestReservations.map((res) => (
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
                                                            title="Hapus Reservasi (Soft Delete)"
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
