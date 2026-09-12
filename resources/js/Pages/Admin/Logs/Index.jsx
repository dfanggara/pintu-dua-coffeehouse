import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LogsIndex({ logs = {}, filters = {} }) {
    const logItems = Array.isArray(logs) ? logs : (logs?.data || []);
    const paginationLinks = logs?.links || [];
    const totalItems = logs?.total ?? logItems.length;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedModule, setSelectedModule] = useState(filters.module || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('admin.logs.index'), {
            search: searchTerm,
            module: selectedModule,
            action: selectedAction,
        }, { preserveState: true });
    };

    const handleFilterChange = (type, value) => {
        let newSearch = searchTerm;
        let newModule = selectedModule;
        let newAction = selectedAction;

        if (type === 'module') newModule = value;
        if (type === 'action') newAction = value;

        if (type === 'module') setSelectedModule(value);
        if (type === 'action') setSelectedAction(value);

        router.get(route('admin.logs.index'), {
            search: newSearch,
            module: newModule,
            action: newAction,
        }, { preserveState: true });
    };

    // Helper to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    // Helper for action badge colors
    const getActionBadge = (action) => {
        switch (action) {
            case 'CREATED':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'UPDATED':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'DELETED':
                return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Log Aktivitas (Audit Trail)
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Pantau riwayat aktivitas Staff dan Admin di dalam sistem.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Log Aktivitas | Pintu Dua Admin" />

            <div className="pt-6 sm:pt-8 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl space-y-4">
                        {/* Search & Filter Form */}
                        <div className="p-4 border-b border-white/10">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Cari nama staff atau aktivitas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#E0E0E0]/40 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={selectedModule}
                                        onChange={(e) => handleFilterChange('module', e.target.value)}
                                        className="bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                    >
                                        <option value="">Semua Modul</option>
                                        <option value="Menu">Menu</option>
                                        <option value="Category">Kategori</option>
                                        <option value="Hero Banner">Hero Banner</option>
                                        <option value="Gallery">Galeri</option>
                                        <option value="Instagram Post">Instagram Post</option>
                                        <option value="Reservation">Reservasi</option>
                                        <option value="User">User</option>
                                    </select>
                                    <select
                                        value={selectedAction}
                                        onChange={(e) => handleFilterChange('action', e.target.value)}
                                        className="bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                    >
                                        <option value="">Semua Aksi</option>
                                        <option value="CREATED">Created</option>
                                        <option value="UPDATED">Updated</option>
                                        <option value="DELETED">Deleted</option>
                                    </select>
                                    <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-[#121212] rounded-xl font-bold text-xs hover:bg-[#ff7b1a] transition-colors">
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 flex justify-between items-center border-b border-white/10">
                            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                Riwayat Aktivitas Terbaru
                            </h3>
                            <span className="text-xs text-[#E0E0E0]/60">Total {totalItems} catatan</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-[#E0E0E0]">
                                <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                    <tr>
                                        <th className="p-3">Waktu Kejadian</th>
                                        <th className="p-3">Nama User (Role)</th>
                                        <th className="p-3">Modul</th>
                                        <th className="p-3">Aksi</th>
                                        <th className="p-3">Deskripsi Lengkap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                Belum ada aktivitas yang terekam di database.
                                            </td>
                                        </tr>
                                    ) : (
                                        logItems.map(log => (
                                            <tr key={log.id} className="hover:bg-white/5 transition-colors duration-200">
                                                <td className="p-3 text-[#E0E0E0]/80 whitespace-nowrap">
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className="p-3">
                                                    {log.user ? (
                                                        <>
                                                            <div className="font-bold text-white">
                                                                {log.user.name}
                                                            </div>
                                                            <div className="text-[10px] text-[#FF6B00]/80">
                                                                {log.user.is_admin ? 'Admin' : 'Staff'}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="font-bold text-white/50 line-through">
                                                                {log.user_name || 'Unknown User'}
                                                            </div>
                                                            <div className="text-[10px] text-rose-400/80">
                                                                (Akun Dihapus)
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="p-3 font-bold text-white">
                                                    {log.module}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${getActionBadge(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-[#E0E0E0]/70">
                                                    {log.description}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {paginationLinks.length > 3 && (
                            <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="text-xs text-[#E0E0E0]/60">
                                    Menampilkan <span className="font-bold text-white">{logs.from || 0}</span> - <span className="font-bold text-white">{logs.to || 0}</span> dari <span className="font-bold text-[#FF6B00]">{logs.total || 0}</span> catatan
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
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
        </AuthenticatedLayout>
    );
}
