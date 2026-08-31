import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Dashboard({ auth = {}, stats = {}, latestReservations = [] }) {
    const adminName = auth?.user?.name || 'Admin Pintu Dua';
    const [deleteTarget, setDeleteTarget] = useState(null);

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
                        <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-[0.25em]">
                            System Overview
                        </span>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Dashboard Utama
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
                        >
                            <span>Lihat Website Live</span>
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>

                        <Link
                            href={route('admin.reservations.index')}
                            className="px-4 py-2 rounded-xl bg-[#FF6B00] text-[#121212] font-bold text-xs uppercase tracking-wider glow-orange-sm hover:scale-105 transition-transform duration-300 flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">table_restaurant</span>
                            <span>Kelola Reservasi</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin | Pintu Dua" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Welcome Banner Card */}
                    <div className="relative rounded-3xl bg-gradient-to-r from-[#181818] via-[#1A1A1A] to-[#121212] border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
                        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-bold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                                    <span>Pintu Dua Coffeehouse Control Panel</span>
                                </div>
                                <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
                                    Selamat Datang Kembali, <span className="text-[#FF6B00]">{adminName}</span>!
                                </h1>
                                <p className="text-xs sm:text-sm text-[#E0E0E0]/70 leading-relaxed font-light">
                                    Kelola reservasi meja pelanggan, katalog menu, gambar promo hero banner, galeri foto komunitas, dan postingan Instagram secara langsung.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                                    <p className="text-[10px] font-bold uppercase text-[#E0E0E0]/60">Status Server</p>
                                    <p className="text-xs font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        <span>ONLINE</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl group hover:border-[#FF6B00]/40 transition-colors duration-300">
                            <div>
                                <p className="text-xs font-semibold text-[#E0E0E0]/60 uppercase tracking-wider">
                                    Reservasi Hari Ini
                                </p>
                                <p className="text-3xl font-black text-white mt-1">
                                    {stats.total_reservations_today ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-2xl">today</span>
                            </div>
                        </div>

                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl group hover:border-yellow-400/40 transition-colors duration-300">
                            <div>
                                <p className="text-xs font-semibold text-yellow-400/80 uppercase tracking-wider">
                                    Pending (Butuh Aksi)
                                </p>
                                <p className="text-3xl font-black text-yellow-400 mt-1">
                                    {stats.pending_reservations ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-2xl">pending_actions</span>
                            </div>
                        </div>

                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl group hover:border-emerald-400/40 transition-colors duration-300">
                            <div>
                                <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">
                                    Status Confirmed
                                </p>
                                <p className="text-3xl font-black text-emerald-400 mt-1">
                                    {stats.confirmed_reservations ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                            </div>
                        </div>

                        <div className="bg-[#181818] p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl group hover:border-white/30 transition-colors duration-300">
                            <div>
                                <p className="text-xs font-semibold text-[#E0E0E0]/60 uppercase tracking-wider">
                                    Katalog Menu Aktif
                                </p>
                                <p className="text-3xl font-black text-white mt-1">
                                    {stats.active_menus ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Management Hub Grid (4 Cards) */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                Management Control Hub
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Card 1: Menu Management */}
                            <Link
                                href={route('admin.menus.index')}
                                className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/60 hover:bg-[#1A1A1A] transition-all duration-300 group flex flex-col justify-between shadow-xl"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
                                            <span className="material-symbols-outlined text-xl">restaurant</span>
                                        </div>
                                        <span className="material-symbols-outlined text-xl text-white/30 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-white group-hover:text-[#FF6B00] transition-colors">
                                            Katalog Menu
                                        </h4>
                                        <p className="text-xs text-[#E0E0E0]/60 leading-relaxed mt-1">
                                            Kelola daftar menu, harga, kategori food & drink, serta upload foto produk.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-[11px] font-bold text-[#E0E0E0]/70">
                                    <span>{stats.active_menus ?? 0} Aktif</span>
                                    <span className="text-[#FF6B00]">Buka Module &rarr;</span>
                                </div>
                            </Link>

                            {/* Card 2: Hero Banner Slider */}
                            <Link
                                href={route('admin.hero-banners.index')}
                                className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/60 hover:bg-[#1A1A1A] transition-all duration-300 group flex flex-col justify-between shadow-xl"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                            <span className="material-symbols-outlined text-xl">view_carousel</span>
                                        </div>
                                        <span className="material-symbols-outlined text-xl text-white/30 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-white group-hover:text-[#FF6B00] transition-colors">
                                            Hero Carousel
                                        </h4>
                                        <p className="text-xs text-[#E0E0E0]/60 leading-relaxed mt-1">
                                            Upload banner promo beranda depan, atur judul & teks penawaran.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-[11px] font-bold text-[#E0E0E0]/70">
                                    <span>{stats.total_hero_banners ?? 0} Slide Banner</span>
                                    <span className="text-[#FF6B00]">Buka Module &rarr;</span>
                                </div>
                            </Link>

                            {/* Card 3: Photo Gallery */}
                            <Link
                                href={route('admin.galleries.index')}
                                className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/60 hover:bg-[#1A1A1A] transition-all duration-300 group flex flex-col justify-between shadow-xl"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                            <span className="material-symbols-outlined text-xl">photo_library</span>
                                        </div>
                                        <span className="material-symbols-outlined text-xl text-white/30 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-white group-hover:text-[#FF6B00] transition-colors">
                                            Galeri Foto
                                        </h4>
                                        <p className="text-xs text-[#E0E0E0]/60 leading-relaxed mt-1">
                                            Upload & atur galeri foto Cafe Vibe serta kebersamaan komunitas.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-[11px] font-bold text-[#E0E0E0]/70">
                                    <span>{stats.total_galleries ?? 0} Foto Terpublikasi</span>
                                    <span className="text-[#FF6B00]">Buka Module &rarr;</span>
                                </div>
                            </Link>

                            {/* Card 4: Instagram Feed */}
                            <Link
                                href={route('admin.instagram-posts.index')}
                                className="bg-[#181818] p-6 rounded-2xl border border-white/10 hover:border-[#FF6B00]/60 hover:bg-[#1A1A1A] transition-all duration-300 group flex flex-col justify-between shadow-xl"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                            <span className="material-symbols-outlined text-xl">camera_alt</span>
                                        </div>
                                        <span className="material-symbols-outlined text-xl text-white/30 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all">
                                            arrow_forward
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base text-white group-hover:text-[#FF6B00] transition-colors">
                                            Instagram Feed
                                        </h4>
                                        <p className="text-xs text-[#E0E0E0]/60 leading-relaxed mt-1">
                                            Kelola postingan Instagram yang tampil di 9 grid halaman utama Home.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-[11px] font-bold text-[#E0E0E0]/70">
                                    <span>{stats.total_instagram_posts ?? 0} Post IG</span>
                                    <span className="text-[#FF6B00]">Buka Module &rarr;</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Latest 5 Reservations Table */}
                    <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#141414]">
                            <div>
                                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#FF6B00] text-base">history</span>
                                    <span>Reservasi Terbaru Masuk</span>
                                </h3>
                                <p className="text-[11px] text-[#E0E0E0]/60">5 pemesanan meja paling akhir</p>
                            </div>

                            <Link
                                href={route('admin.reservations.index')}
                                className="text-xs text-[#FF6B00] font-bold hover:underline flex items-center gap-1"
                            >
                                <span>Lihat Semua Reservasi</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
                                                <td className="p-4 font-semibold text-white">
                                                    {res.pax} orang
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{res.reservation_date}</div>
                                                    <div className="text-[#FF6B00] font-semibold">{res.reservation_time} WIB</div>
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
