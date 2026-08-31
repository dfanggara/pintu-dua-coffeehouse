import React, { useState, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function InstagramPostsIndex({ posts = {}, filters = {} }) {
    const postItems = Array.isArray(posts) ? posts : (posts?.data || []);
    const paginationLinks = posts?.links || [];
    const totalItems = posts?.total ?? postItems.length;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [editingPost, setEditingPost] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, reset, errors, processing } = useForm({
        code: '',
        caption: '',
        post_url: '',
        post_type: 'image', // 'image', 'video', or 'carousel'
        thumbnail: null,
        thumbnail_url: '',
        sort_order: 0,
        is_active: true,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.instagram-posts.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearForm = () => {
        setEditingPost(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        reset();
    };

    const generateCodePreview = () => {
        return `IGP-${Date.now().toString(36).toUpperCase()}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            caption: data.caption || '',
            post_url: data.post_url,
            post_type: data.post_type || 'image',
            sort_order: data.sort_order || 0,
            is_active: data.is_active ? 1 : 0,
        };

        if (editingPost) {
            if (data.thumbnail instanceof File) {
                payload.thumbnail = data.thumbnail;
                payload._method = 'put';
                router.post(route('admin.instagram-posts.post-update', editingPost.code), payload, {
                    onSuccess: () => clearForm(),
                });
            } else {
                router.put(route('admin.instagram-posts.update', editingPost.code), payload, {
                    onSuccess: () => clearForm(),
                });
            }
        } else {
            payload.code = data.code || generateCodePreview();
            if (data.thumbnail instanceof File) {
                payload.thumbnail = data.thumbnail;
            }

            router.post(route('admin.instagram-posts.store'), payload, {
                onSuccess: () => clearForm(),
            });
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setImagePreview(post.thumbnail_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setData({
            code: post.code,
            caption: post.caption || '',
            post_url: post.post_url || '',
            post_type: post.post_type || 'image',
            thumbnail: null,
            thumbnail_url: post.thumbnail_url || '',
            sort_order: post.sort_order || 0,
            is_active: Boolean(post.is_active),
        });
    };

    const handleDelete = (code) => {
        if (confirm('Yakin ingin menghapus postingan Instagram ini dari database?')) {
            router.delete(route('admin.instagram-posts.destroy', code));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Manajemen Instagram Feed
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Kelola 9 postingan Instagram teratas yang tampil di halaman utama Home
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/40 text-sm">search</span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari caption / code..."
                                className="bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#FF6B00] outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            }
        >
            <Head title="Manajemen Instagram Feed | Pintu Dua Admin" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Form Input (4 cols) */}
                        <div className="lg:col-span-4">
                            <div className="bg-[#181818] border border-white/10 p-5 rounded-2xl shadow-xl sticky top-24">
                                <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
                                    <span>{editingPost ? 'Edit Instagram Post' : 'Tambah Postingan IG'}</span>
                                    {editingPost && (
                                        <button
                                            type="button"
                                            onClick={clearForm}
                                            className="text-[10px] text-rose-400 hover:underline uppercase"
                                        >
                                            + Tambah Baru
                                        </button>
                                    )}
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">URL Postingan Instagram</label>
                                        <input
                                            type="url"
                                            value={data.post_url}
                                            onChange={e => {
                                                const url = e.target.value;
                                                const match = url.match(/(?:p|reel|tv|reels)\/([A-Za-z0-9_-]+)/i);
                                                if (match && match[1] && !editingPost) {
                                                    setData({
                                                        ...data,
                                                        post_url: url,
                                                        code: match[1]
                                                    });
                                                } else {
                                                    setData('post_url', url);
                                                }
                                            }}
                                            placeholder="https://www.instagram.com/p/C3x9Y0vL1aZ/"
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                            required
                                        />
                                        <p className="text-[10px] text-white/40 mt-1">
                                            Tempel link postingan IG Anda di sini (otomatis mengekstrak shortcode)
                                        </p>
                                        {errors.post_url && <p className="text-rose-400 text-[10px] mt-1">{errors.post_url}</p>}
                                    </div>

                                    {!editingPost && (
                                        <div>
                                            <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">
                                                Kode Post (Shortcode) <span className="text-[10px] text-[#FF6B00] font-normal">(Otomatis/Opsional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.code}
                                                onChange={e => setData('code', e.target.value)}
                                                placeholder="Kosongkan untuk otomatis dibuat"
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none font-mono"
                                            />
                                            {errors.code && <p className="text-rose-400 text-[10px] mt-1">{errors.code}</p>}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Tipe Konten</label>
                                            <select
                                                value={data.post_type}
                                                onChange={e => setData('post_type', e.target.value)}
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                            >
                                                <option value="image">Single Image</option>
                                                <option value="video">Reels / Video</option>
                                                <option value="carousel">Carousel (Multi)</option>
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
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Caption / Deskripsi Brief</label>
                                        <textarea
                                            rows="2"
                                            value={data.caption}
                                            onChange={e => setData('caption', e.target.value)}
                                            placeholder="Caption singkat postingan"
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">
                                            Upload Thumbnail Cover ({editingPost ? 'Opsional' : 'Wajib'})
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required={!editingPost}
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2 text-xs text-[#E0E0E0]/80 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FF6B00] file:text-[#121212] cursor-pointer"
                                            />
                                            {imagePreview && (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.thumbnail && <p className="text-rose-400 text-[10px] mt-1">{errors.thumbnail}</p>}
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                className="rounded border-white/20 bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00]"
                                            />
                                            <span className="font-bold text-white uppercase text-[11px]">Tampilkan (Aktif)</span>
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-5 py-2.5 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {processing && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                            <span>{processing ? 'Menyimpan...' : (editingPost ? 'Simpan Edit' : 'Tambah Post')}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Table / Grid View (8 cols) */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#141414]">
                                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                        Daftar Postingan Instagram ({totalItems})
                                    </h3>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-[#E0E0E0]/80">
                                        <thead className="bg-white/5 uppercase text-[10px] font-bold text-white/60 tracking-wider">
                                            <tr>
                                                <th className="p-3">Cover</th>
                                                <th className="p-3">Shortcode & Tipe</th>
                                                <th className="p-3">Caption</th>
                                                <th className="p-3">Urutan</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {postItems.length > 0 ? (
                                                postItems.map((post) => (
                                                    <tr key={post.code} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-3">
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0 relative">
                                                                <img src={post.thumbnail_url} alt={post.code} className="w-full h-full object-cover" />
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="font-mono text-white font-bold">{post.code}</div>
                                                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/10 text-[#FF6B00]">
                                                                {post.post_type}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 max-w-[200px]">
                                                            <p className="line-clamp-2 text-white/90">{post.caption || '-'}</p>
                                                            <a
                                                                href={post.post_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[10px] text-[#FF6B00] hover:underline flex items-center gap-1 mt-0.5"
                                                            >
                                                                <span>Link Post</span>
                                                                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                                                            </a>
                                                        </td>
                                                        <td className="p-3 font-bold text-white">{post.sort_order}</td>
                                                        <td className="p-3">
                                                            {post.is_active ? (
                                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                    Aktif
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                                    Nonaktif
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(post)}
                                                                    className="px-2.5 py-1 bg-white/10 hover:bg-[#FF6B00] hover:text-[#121212] text-white rounded-lg font-bold text-[10px] uppercase transition-all"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(post.code)}
                                                                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg font-bold text-[10px] uppercase transition-all"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="p-6 text-center text-white/40 italic">
                                                        Belum ada postingan Instagram di database. Silakan tambah data di samping.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Links */}
                                {paginationLinks.length > 3 && (
                                    <div className="p-3 border-t border-white/10 flex justify-center gap-1 bg-[#141414]">
                                        {paginationLinks.map((link, key) => (
                                            link.url ? (
                                                <Link
                                                    key={key}
                                                    href={link.url}
                                                    className={`px-3 py-1 text-xs rounded-lg font-bold ${
                                                        link.active ? 'bg-[#FF6B00] text-[#121212]' : 'bg-white/5 text-white/70 hover:bg-white/10'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={key}
                                                    className="px-3 py-1 text-xs rounded-lg text-white/30"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
