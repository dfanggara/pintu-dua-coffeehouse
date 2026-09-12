import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function UsersIndex({ users = {} }) {
    const { auth } = usePage().props;
    const userItems = Array.isArray(users) ? users : (users?.data || []);
    const paginationLinks = users?.links || [];
    const totalItems = users?.total ?? userItems.length;

    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
    });

    const clearForm = () => {
        setEditingUser(null);
        reset();
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            is_admin: Boolean(user.is_admin),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => clearForm(),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => clearForm(),
            });
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route('admin.users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Manajemen User & Staff
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Kelola hak akses Admin dan Staff untuk mengelola konten Pintu Dua Coffeehouse.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen User | Pintu Dua Admin" />

            <div className="pt-6 sm:pt-8 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Create / Edit User Form */}
                        <div className="lg:col-span-4 bg-[#181818] p-6 rounded-2xl border border-white/10 space-y-4 h-fit">
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider">
                                    {editingUser ? 'Edit Akun User' : 'Tambah Akun Baru'}
                                </h3>
                                {editingUser && (
                                    <button onClick={clearForm} className="text-xs text-rose-400 hover:underline">
                                        Batal Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Nama user..."
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        required
                                    />
                                    {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        required
                                    />
                                    {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">
                                        Password {editingUser && '(Kosongkan jika tidak ingin diubah)'}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Min. 8 karakter"
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        required={!editingUser}
                                    />
                                    {errors.password && <p className="text-rose-400 text-[10px] mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password"
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        required={!editingUser || data.password.length > 0}
                                    />
                                </div>

                                <div className="pt-2 pb-1 border-y border-white/10 my-3">
                                    <label className={`flex items-center gap-2 py-2 ${editingUser?.id === auth.user.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.is_admin}
                                            onChange={e => setData('is_admin', e.target.checked)}
                                            disabled={editingUser?.id === auth.user.id}
                                            className="rounded border-white/20 bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00] disabled:opacity-50"
                                        />
                                        <div>
                                            <span className="text-white font-bold block text-sm">Hak Akses Admin Penuh</span>
                                            <span className="text-[10px] text-[#E0E0E0]/60 block mt-0.5">
                                                {editingUser?.id === auth.user.id 
                                                    ? 'Anda tidak dapat mengubah hak akses akun Anda sendiri.'
                                                    : 'Jika dicentang, akun ini dapat mengatur User & melihat Log. Jika tidak dicentang, akun ini hanya Staff.'}
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-transform duration-200"
                                    >
                                        {editingUser ? 'Simpan Perubahan Akun' : 'Tambah Akun Baru'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: Users List Table */}
                        <div className="lg:col-span-8 bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl space-y-4">
                            <div className="p-4 flex justify-between items-center border-b border-white/10">
                                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                    Daftar Akun Terdaftar
                                </h3>
                                <span className="text-xs text-[#E0E0E0]/60">Total {totalItems} user</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-[#E0E0E0]">
                                    <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                        <tr>
                                            <th className="p-3">Nama</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role Akses</th>
                                            <th className="p-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {userItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                    Belum ada user di database.
                                                </td>
                                            </tr>
                                        ) : (
                                            userItems.map(user => (
                                                <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
                                                    <td className="p-3 font-bold text-white">
                                                        {user.name}
                                                    </td>
                                                    <td className="p-3 text-[#E0E0E0]/80">
                                                        {user.email}
                                                    </td>
                                                    <td className="p-3">
                                                        {user.is_admin ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                                                <span>Admin</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 whitespace-nowrap">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                                <span>Staff</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleEditClick(user)}
                                                                className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-bold"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-[11px] font-bold"
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
                                <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div className="text-xs text-[#E0E0E0]/60">
                                        Menampilkan <span className="font-bold text-white">{users.from || 0}</span> - <span className="font-bold text-white">{users.to || 0}</span> dari <span className="font-bold text-[#FF6B00]">{users.total || 0}</span> user
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
            </div>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                title="Hapus Akun User"
                message={`Apakah Anda yakin ingin menghapus akun ${userToDelete?.name}? Jika dihapus, akun ini tidak dapat mengakses sistem lagi.`}
                onConfirm={confirmDelete}
                onClose={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
