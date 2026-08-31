import React, { useState, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function GalleriesIndex({ galleries = {}, filters = {} }) {
    const galleryItems = Array.isArray(galleries) ? galleries : (galleries?.data || []);
    const paginationLinks = galleries?.links || [];
    const totalItems = galleries?.total ?? galleryItems.length;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [editingGallery, setEditingGallery] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, reset, errors, processing } = useForm({
        code: '',
        title: '',
        category: 'vibe', // 'vibe' or 'community'
        description: '',
        image: null,
        image_url: '',
        sort_order: 0,
        is_active: true,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.galleries.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearForm = () => {
        setEditingGallery(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            title: data.title,
            category: data.category || 'vibe',
            description: data.description || '',
            sort_order: data.sort_order || 0,
            is_active: data.is_active ? 1 : 0,
        };

        if (editingGallery) {
            if (data.image instanceof File) {
                payload.image = data.image;
                payload._method = 'put';
                router.post(route('admin.galleries.post-update', editingGallery.code), payload, {
                    onSuccess: () => clearForm(),
                });
            } else {
                router.put(route('admin.galleries.update', editingGallery.code), payload, {
                    onSuccess: () => clearForm(),
                });
            }
        } else {
            if (data.image instanceof File) {
                payload.image = data.image;
            }
            router.post(route('admin.galleries.store'), payload, {
                onSuccess: () => clearForm(),
            });
        }
    };

    const handleEditClick = (g) => {
        setEditingGallery(g);
        setImagePreview(g.image_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setData({
            code: g.code,
            title: g.title,
            category: g.category || 'vibe',
            description: g.description || '',
            image: null,
            image_url: g.image_url || '',
            sort_order: g.sort_order || 0,
            is_active: Boolean(g.is_active),
        });
    };

    const handleDelete = (code) => {
        if (confirm('Yakin ingin menghapus Foto Galeri ini?')) {
            router.delete(route('admin.galleries.destroy', code));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Galeri Foto Management
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Upload & kelola galeri foto Cafe Vibe & Kebersamaan Komunitas Pintu Dua
                        </p>
                    </div>

                    <Link
                        href={route('admin.hero-banners.index')}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all duration-300"
                    >
                        &larr; Ke Hero Banners
                    </Link>
                </div>
            }
        >
            <Head title="Admin Galeri Foto | Pintu Dua" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Create / Edit Gallery Form */}
                        <div className="lg:col-span-5 bg-[#181818] p-6 rounded-2xl border border-white/10 space-y-4 h-fit">
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider">
                                    {editingGallery ? 'Edit Foto Galeri' : 'Upload Foto Galeri Baru'}
                                </h3>
                                {editingGallery && (
                                    <button onClick={clearForm} className="text-xs text-rose-400 hover:underline">
                                        Batal Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Judul Foto</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="Contoh: Underground Interior & Neon Lights"
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        required
                                    />
                                    {errors.title && <p className="text-rose-400 text-[10px] mt-1">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Kategori Galeri</label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none font-bold text-[#FF6B00]"
                                            required
                                        >
                                            <option value="vibe">Cafe Vibe & Suasana</option>
                                            <option value="community">Community & Kebersamaan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Urutan Tampil</label>
                                        <input
                                            type="number"
                                            value={data.sort_order}
                                            onChange={e => setData('sort_order', e.target.value)}
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Deskripsi Foto</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Deskripsi singkat mengenai foto"
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                    />
                                </div>

                                {/* Upload File Foto */}
                                <div>
                                    <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">
                                        Upload File Foto ({editingGallery ? 'Opsional' : 'Wajib'})
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required={!editingGallery}
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2 text-xs text-[#E0E0E0]/80 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FF6B00] file:text-[#121212] cursor-pointer"
                                        />
                                        {imagePreview && (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && <p className="text-rose-400 text-[10px] mt-1">{errors.image}</p>}
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="rounded border-white/20 bg-[#121212] text-emerald-400 focus:ring-emerald-400"
                                        />
                                        <span className="text-white font-bold">Foto Aktif (Tampil di Website)</span>
                                    </label>
                                </div>

                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-transform duration-200"
                                    >
                                        {editingGallery ? 'Simpan Perubahan Foto' : 'Upload & Tambah Foto Galeri'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: Gallery List Table */}
                        <div className="lg:col-span-7 bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl space-y-4">
                            {/* Search Form */}
                            <div className="p-4 border-b border-white/10">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Cari foto galeri..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#E0E0E0]/40 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                    />
                                    <button type="submit" className="px-3.5 py-2 bg-[#FF6B00] text-[#121212] rounded-xl font-bold text-xs">Cari</button>
                                </form>
                            </div>

                            <div className="p-4 flex justify-between items-center">
                                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                    Daftar Foto Galeri
                                </h3>
                                <span className="text-xs text-[#E0E0E0]/60">Total {totalItems} foto</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-[#E0E0E0]">
                                    <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                        <tr>
                                            <th className="p-3">Foto</th>
                                            <th className="p-3">Kode & Judul</th>
                                            <th className="p-3">Kategori</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {galleryItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                    Belum ada foto galeri di database.
                                                </td>
                                            </tr>
                                        ) : (
                                            galleryItems.map(g => (
                                                <tr key={g.code} className="hover:bg-white/5 transition-colors duration-200">
                                                    <td className="p-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-[#121212]">
                                                            <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="font-bold text-white uppercase">{g.title}</div>
                                                        <div className="text-[10px] font-mono text-[#FF6B00]/80">{g.code}</div>
                                                    </td>
                                                    <td className="p-3">
                                                        {g.category === 'vibe' ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                                Cafe Vibe
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                                                Community
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        {g.is_active ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                                                <span>Aktif</span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 whitespace-nowrap">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                                <span>Draft</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleEditClick(g)}
                                                                className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-bold"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(g.code)}
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
            </div>
        </AuthenticatedLayout>
    );
}
