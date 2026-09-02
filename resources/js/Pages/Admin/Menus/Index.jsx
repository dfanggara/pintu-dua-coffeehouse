import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function MenusIndex({ menus = {}, categories = [], filters = {} }) {
    const menuItems = Array.isArray(menus) ? menus : (menus?.data || []);
    const paginationLinks = menus?.links || [];
    const totalItems = menus?.total ?? menuItems.length;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [activeTab, setActiveTab] = useState('menus'); // 'menus' or 'categories'
    const [editingMenu, setEditingMenu] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [deleteMenuTarget, setDeleteMenuTarget] = useState(null);
    const [deleteCatTarget, setDeleteCatTarget] = useState(null);

    const fileInputRef = useRef(null);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('admin.menus.index'), {
            search: searchTerm,
            category: selectedCategory,
        }, { preserveState: true });
    };

    const handleCategoryFilterChange = (catSlug) => {
        setSelectedCategory(catSlug);
        router.get(route('admin.menus.index'), {
            search: searchTerm,
            category: catSlug,
        }, { preserveState: true });
    };

    // Helper to generate SKU preview on frontend based on category slug & menu count
    const generateSkuPreview = (catSlug) => {
        if (!catSlug) return 'MNU-GEN-001';
        const cleanSlug = catSlug.replace(/[-_]/g, '');
        let prefix = cleanSlug.substring(0, 3).toUpperCase();
        if (prefix.length < 3) prefix = prefix.padEnd(3, 'X');
        
        const countInCat = menuItems.filter(m => m.category_slug === catSlug).length + 1;
        return `MNU-${prefix}-${String(countInCat).padStart(3, '0')}`;
    };

    // Form state for Menu CRUD
    const { data: menuData, setData: setMenuData, reset: resetMenu, errors: menuErrors, processing: menuProcessing } = useForm({
        sku: '',
        category_slug: categories[0]?.slug || '',
        name: '',
        description: '',
        price: '',
        image: null,
        image_url: '',
        is_highlight: false,
        is_active: true,
    });

    // Form state for Category CRUD
    const { data: catData, setData: setCatData, post: postCat, put: putCat, reset: resetCat, errors: catErrors, processing: catProcessing } = useForm({
        slug: '',
        name: '',
        type: 'drink',
        description: '',
    });

    // Auto-update SKU preview when category selection changes in Add Mode
    useEffect(() => {
        if (!editingMenu && menuData.category_slug) {
            const preview = generateSkuPreview(menuData.category_slug);
            setMenuData('sku', preview);
        }
    }, [menuData.category_slug, editingMenu, menus]);

    const handleMenuImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMenuData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleImageChange = handleMenuImageChange;

    const clearForm = () => {
        setEditingMenu(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        resetMenu();
        const initialCat = menuData.category_slug || categories[0]?.slug || '';
        setMenuData({
            sku: generateSkuPreview(initialCat),
            category_slug: initialCat,
            name: '',
            description: '',
            price: '',
            image: null,
            image_url: '',
            is_highlight: false,
            is_active: true,
        });
    };

    const handleMenuSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            category_slug: menuData.category_slug,
            name: menuData.name,
            description: menuData.description || '',
            price: menuData.price,
            image_url: menuData.image_url || '',
            is_highlight: menuData.is_highlight ? 1 : 0,
            is_active: menuData.is_active ? 1 : 0,
        };

        if (editingMenu) {
            // EDITING EXISTING MENU
            if (menuData.image instanceof File) {
                payload.image = menuData.image;
                payload._method = 'put';
                router.post(route('admin.menus.post-update', editingMenu.sku), payload, {
                    onSuccess: () => {
                        clearForm();
                    },
                });
            } else {
                router.put(route('admin.menus.update', editingMenu.sku), payload, {
                    onSuccess: () => {
                        clearForm();
                    },
                });
            }
        } else {
            // ADDING NEW MENU (Omit SKU so backend generateAutoSku creates guaranteed unique SKU)
            if (menuData.image instanceof File) {
                payload.image = menuData.image;
            }

            router.post(route('admin.menus.store'), payload, {
                onSuccess: () => {
                    clearForm();
                },
            });
        }
    };

    const handleMenuEdit = (menu) => {
        setEditingMenu(menu);
        setImagePreview(menu.image_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setMenuData({
            sku: menu.sku,
            category_slug: menu.category_slug,
            name: menu.name,
            description: menu.description || '',
            price: menu.price,
            image: null,
            image_url: menu.image_url || '',
            is_highlight: Boolean(menu.is_highlight),
            is_active: Boolean(menu.is_active),
        });
    };
    const handleEditMenuClick = handleMenuEdit;

    const handleMenuDelete = (sku) => {
        setDeleteMenuTarget(sku);
    };

    // Category CRUD Handlers
    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            putCat(route('admin.categories.update', editingCategory.slug), {
                onSuccess: () => {
                    setEditingCategory(null);
                    resetCat();
                },
            });
        } else {
            postCat(route('admin.categories.store'), {
                onSuccess: () => {
                    resetCat();
                },
            });
        }
    };

    const handleEditCategoryClick = (cat) => {
        setEditingCategory(cat);
        setCatData({
            slug: cat.slug,
            name: cat.name,
            type: cat.type || 'drink',
            description: cat.description || '',
        });
    };

    const handleCategoryDelete = (slug) => {
        setDeleteCatTarget(slug);
    };

    const cancelCategoryEdit = () => {
        setEditingCategory(null);
        resetCat();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                            Katalog & Kategori Management
                        </h2>
                        <p className="text-xs text-[#E0E0E0]/60">
                            Kelola daftar menu, upload foto produk, & kategori Pintu Dua Coffeehouse
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.reservations.index')}
                            className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all duration-300"
                        >
                            &larr; Ke Reservasi
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin Menu & Category Catalog | Pintu Dua" />

            <div className="pt-6 sm:pt-8 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Tab Switcher: Menus Catalog vs Categories */}
                    <div className="flex items-center gap-2 bg-[#181818] p-1.5 rounded-2xl border border-white/10 w-fit">
                        <button
                            onClick={() => setActiveTab('menus')}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                                activeTab === 'menus'
                                    ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm shadow-md'
                                    : 'text-[#E0E0E0]/70 hover:text-white'
                            }`}
                        >
                            Katalog Menu ({menus.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                                activeTab === 'categories'
                                    ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm shadow-md'
                                    : 'text-[#E0E0E0]/70 hover:text-white'
                            }`}
                        >
                            Kategori Menu ({categories.length})
                        </button>
                    </div>

                    {/* TAB 1: MENU CATALOG MANAGEMENT (WITH AUTOMATIC SKU & FILE UPLOAD) */}
                    {activeTab === 'menus' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Create / Edit Menu Form */}
                            <div className="lg:col-span-5 bg-[#181818] p-6 rounded-2xl border border-white/10 space-y-4 h-fit">
                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                    <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider">
                                        {editingMenu ? 'Edit Item Menu' : 'Tambah Menu Baru'}
                                    </h3>
                                    {editingMenu && (
                                        <button onClick={clearForm} className="text-xs text-rose-400 hover:underline">
                                            Batal Edit
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleMenuSubmit} className="space-y-3 text-xs">
                                    {Object.keys(menuErrors).length > 0 && (
                                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                                            <p className="font-bold">Gagal menyimpan menu:</p>
                                            <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                                                {Object.entries(menuErrors).map(([key, msg]) => (
                                                    <li key={key}>{msg}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Auto-Generated SKU Preview Field */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="font-bold text-[#E0E0E0]/80 uppercase">
                                                SKU (Kode Unik Menu)
                                            </label>
                                            <span className="text-[10px] font-black uppercase text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/30">
                                                ⚡ Auto-Generated
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={menuData.sku}
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-[#FF6B00] font-mono font-bold outline-none cursor-not-allowed opacity-90 shadow-inner"
                                            title="Kode SKU ini di-generate otomatis mengikuti kategori yang Anda pilih."
                                        />
                                        <p className="text-[10px] text-[#E0E0E0]/50 mt-1">
                                            Kode SKU otomatis dibuat mengikuti kategori yang dipilih.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Kategori</label>
                                            <select
                                                value={menuData.category_slug}
                                                onChange={e => setMenuData('category_slug', e.target.value)}
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                                required
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.slug} value={cat.slug}>{cat.name} ({cat.type === 'food' ? 'Food' : 'Drink'})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Harga (Rp)</label>
                                            <input
                                                type="number"
                                                value={menuData.price}
                                                onChange={e => setMenuData('price', e.target.value)}
                                                placeholder="35000"
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Nama Menu</label>
                                        <input
                                            type="text"
                                            value={menuData.name}
                                            onChange={e => setMenuData('name', e.target.value)}
                                            placeholder="Nama item menu"
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Upload Foto File Section */}
                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">
                                            Upload Foto Produk ({editingMenu ? 'Opsional' : 'Wajib'})
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMenuImageChange}
                                                required={!editingMenu}
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2 text-xs text-[#E0E0E0]/80 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FF6B00] file:text-[#121212] cursor-pointer"
                                            />
                                            {imagePreview && (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        {menuErrors.image && <p className="text-rose-400 text-[10px] mt-1">{menuErrors.image}</p>}
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Deskripsi Menu</label>
                                        <textarea
                                            rows="2"
                                            value={menuData.description}
                                            onChange={e => setMenuData('description', e.target.value)}
                                            placeholder="Deskripsi singkat rasa dan komposisi"
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={menuData.is_highlight}
                                                onChange={e => setMenuData('is_highlight', e.target.checked)}
                                                className="rounded border-white/20 bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00]"
                                            />
                                            <span className="text-white font-bold">Highlight (Hero Card)</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={menuData.is_active}
                                                onChange={e => setMenuData('is_active', e.target.checked)}
                                                className="rounded border-white/20 bg-[#121212] text-emerald-400 focus:ring-emerald-400"
                                            />
                                            <span className="text-white font-bold">Menu Aktif</span>
                                        </label>
                                    </div>

                                    <div className="pt-3">
                                        <button
                                            type="submit"
                                            disabled={menuProcessing}
                                            className="w-full py-3 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-transform duration-200"
                                        >
                                            {editingMenu ? 'Simpan Perubahan' : 'Upload & Tambah Menu'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right Column: Menu List Table */}
                            <div className="lg:col-span-7 bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl space-y-4">
                                {/* Search & Category Filter Form */}
                                <div className="p-4 border-b border-white/10">
                                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => handleCategoryFilterChange(e.target.value)}
                                            className="bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-medium"
                                        >
                                            <option value="">Semua Kategori</option>
                                            <option value="signature" className="font-bold text-[#FF6B00]">
                                                ⭐ Signature (Highlight Menu)
                                            </option>
                                            {categories.map((cat) => (
                                                <option key={cat.slug} value={cat.slug}>
                                                    {cat.name} ({cat.type === 'food' ? 'Food' : 'Drink'})
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            placeholder="Cari berdasarkan nama atau SKU menu..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#E0E0E0]/40 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                                        />
                                        <button type="submit" className="px-4 py-2 bg-[#FF6B00] text-[#121212] rounded-xl font-bold text-xs hover:bg-[#ff7b1a] transition-colors">
                                            Cari
                                        </button>
                                        {(searchTerm || selectedCategory) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setSelectedCategory('');
                                                    router.get(route('admin.menus.index'), {}, { preserveState: true });
                                                }}
                                                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-colors"
                                            >
                                                Reset Filter
                                            </button>
                                        )}
                                    </form>
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                        Daftar Katalog Menu
                                    </h3>
                                    <span className="text-xs text-[#E0E0E0]/60">Total {totalItems} menu</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-[#E0E0E0]">
                                        <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                            <tr>
                                                <th className="p-3">Foto</th>
                                                <th className="p-3">SKU & Nama</th>
                                                <th className="p-3">Kategori</th>
                                                <th className="p-3">Harga</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {menuItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                        Belum ada menu di database.
                                                    </td>
                                                </tr>
                                            ) : (
                                                menuItems.map(menu => (
                                                    <tr key={menu.sku} className="hover:bg-white/5 transition-colors duration-200">
                                                        <td className="p-3">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-[#121212]">
                                                                <img src={menu.image_url || '/images/espresso.png'} alt={menu.name} className="w-full h-full object-cover" />
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="font-bold text-white flex items-center gap-1.5">
                                                                <span>{menu.name}</span>
                                                                {menu.is_highlight && (
                                                                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-[#FF6B00]/20 text-[#FF6B00] rounded border border-[#FF6B00]/40">
                                                                        Signature
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] font-mono text-[#FF6B00]/80">{menu.sku}</div>
                                                        </td>
                                                        <td className="p-3 text-[#E0E0E0]/70">
                                                            {menu.category?.name || menu.category_slug}
                                                        </td>
                                                        <td className="p-3 font-bold text-white">
                                                            Rp {Number(menu.price).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="p-3">
                                                            {menu.is_active ? (
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
                                                                    onClick={() => handleMenuEdit(menu)}
                                                                    className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-bold"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMenuDelete(menu.sku)}
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

                                {/* Pagination Links (Limited to 8 Items per Page) */}
                                {paginationLinks.length > 3 && (
                                    <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                                        <div className="text-xs text-[#E0E0E0]/60">
                                            Menampilkan <span className="font-bold text-white">{menus.from || 0}</span> - <span className="font-bold text-white">{menus.to || 0}</span> dari <span className="font-bold text-[#FF6B00]">{menus.total || 0}</span> menu
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
                    )}

                    {/* TAB 2: CATEGORY MANAGEMENT (CRUD CATEGORIES WITH DRINK/FOOD TYPE) */}
                    {activeTab === 'categories' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Create / Edit Category Form */}
                            <div className="lg:col-span-5 bg-[#181818] p-6 rounded-2xl border border-white/10 space-y-4 h-fit">
                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                    <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider">
                                        {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                                    </h3>
                                    {editingCategory && (
                                        <button onClick={cancelCategoryEdit} className="text-xs text-rose-400 hover:underline">
                                            Batal Edit
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleCategorySubmit} className="space-y-3 text-xs">
                                    <div>
                                        <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Nama Kategori</label>
                                        <input
                                            type="text"
                                            value={catData.name}
                                            onChange={e => setCatData('name', e.target.value)}
                                            placeholder="Contoh: Cold Brew Series"
                                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Tipe Tab</label>
                                            <select
                                                value={catData.type}
                                                onChange={e => setCatData('type', e.target.value)}
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none font-bold text-[#FF6B00]"
                                                required
                                            >
                                                <option value="drink">Drink (Minuman)</option>
                                                <option value="food">Food (Makanan)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#E0E0E0]/80 mb-1 uppercase">Auto Slug </label>
                                            <input
                                                type="text"
                                                disabled={Boolean(editingCategory)}
                                                value={catData.slug}
                                                onChange={e => setCatData('slug', e.target.value)}
                                                placeholder="cold-brew-series"
                                                className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-white focus:border-[#FF6B00] outline-none disabled:opacity-50"
                                            />
                                            {catErrors.slug && <p className="text-rose-400 text-[10px] mt-1">{catErrors.slug}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-3">
                                        <button
                                            type="submit"
                                            disabled={catProcessing}
                                            className="w-full py-3 rounded-xl bg-[#FF6B00] text-[#121212] font-black text-xs uppercase tracking-wider glow-orange-sm hover:scale-[1.02] transition-transform duration-200"
                                        >
                                            {editingCategory ? 'Simpan Perubahan Kategori' : 'Tambah Kategori Ke Database'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right Column: Category List Table */}
                            <div className="lg:col-span-7 bg-[#181818] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                                        Daftar Kategori Menu
                                    </h3>
                                    <span className="text-xs text-[#E0E0E0]/60">Total {categories.length} kategori</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-[#E0E0E0]">
                                        <thead className="bg-[#121212] text-[#FF6B00] uppercase font-bold tracking-wider border-b border-white/10">
                                            <tr>
                                                <th className="p-3">Slug (Key)</th>
                                                <th className="p-3">Nama Kategori</th>
                                                <th className="p-3">Tipe Tab</th>
                                                <th className="p-3">Jumlah Menu</th>
                                                <th className="p-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {categories.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-[#E0E0E0]/50 italic">
                                                        Belum ada kategori di database.
                                                    </td>
                                                </tr>
                                            ) : (
                                                categories.map(cat => (
                                                    <tr key={cat.slug} className="hover:bg-white/5 transition-colors duration-200">
                                                        <td className="p-3 font-mono font-bold text-[#FF6B00]">
                                                            {cat.slug}
                                                        </td>
                                                        <td className="p-3 font-bold text-white">
                                                            {cat.name}
                                                        </td>
                                                        <td className="p-3">
                                                            {cat.type === 'food' ? (
                                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                                    Food
                                                                </span>
                                                            ) : (
                                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                                                    Drink
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-[#E0E0E0]/80">
                                                            {cat.menus_count ?? 0} menu
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <button
                                                                    onClick={() => handleEditCategoryClick(cat)}
                                                                    className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-bold"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCategoryDelete(cat.slug)}
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
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Confirm Delete Modal for Menu */}
            <ConfirmDeleteModal
                isOpen={Boolean(deleteMenuTarget)}
                title="Hapus Item Menu"
                message={`Apakah Anda yakin ingin menghapus item menu (${deleteMenuTarget}) ini secara permanen dari database?`}
                onConfirm={() => {
                    if (deleteMenuTarget) {
                        router.delete(route('admin.menus.destroy', deleteMenuTarget));
                    }
                }}
                onClose={() => setDeleteMenuTarget(null)}
            />

            {/* Custom Confirm Delete Modal for Category */}
            <ConfirmDeleteModal
                isOpen={Boolean(deleteCatTarget)}
                title="Hapus Kategori Menu"
                message={`Apakah Anda yakin ingin menghapus kategori (${deleteCatTarget}) ini beserta seluruh menu di dalamnya?`}
                onConfirm={() => {
                    if (deleteCatTarget) {
                        router.delete(route('admin.categories.destroy', deleteCatTarget));
                    }
                }}
                onClose={() => setDeleteCatTarget(null)}
            />
        </AuthenticatedLayout>
    );
}
