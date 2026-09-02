import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const flash = usePage().props.flash;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
            {/* Top Dark Header Nav */}
            <nav className="border-b border-white/10 bg-[#181818] sticky top-0 z-40 shadow-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-6">
                            {/* Brand Logo */}
                            <Link href="/" className="flex items-center gap-3">
                                <img
                                    src="/images/logo.png"
                                    alt="Pintu Dua Logo"
                                    className="h-9 w-auto object-contain rounded-lg glow-orange-sm"
                                />
                                <div className="flex flex-col">
                                    <span className="font-display text-lg uppercase tracking-wider text-white leading-none">
                                        PINTU DUA
                                    </span>
                                    <span className="text-[9px] font-bold uppercase text-[#FF6B00] tracking-[0.2em] leading-tight">
                                        Admin Panel
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden space-x-2 lg:space-x-3 md:flex items-center">
                                <Link
                                    href={route('dashboard')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                        route().current('dashboard')
                                            ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('admin.reservations.index')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                        route().current('admin.reservations.*')
                                            ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Reservasi Meja
                                </Link>
                                <Link
                                    href={route('admin.menus.index')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                        route().current('admin.menus.*')
                                            ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Katalog Menu
                                </Link>
                                <Link
                                    href={route('admin.hero-banners.index')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                        route().current('admin.hero-banners.*')
                                            ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Hero Banners
                                </Link>
                                <Link
                                    href={route('admin.galleries.index')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                        route().current('admin.galleries.*')
                                            ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Galeri Foto
                                </Link>
                                <Link
                                    href={route('admin.instagram-posts.index')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                        route().current('admin.instagram-posts.*')
                                            ? 'bg-[#FF6B00] text-[#121212] glow-orange-sm'
                                            : 'text-[#E0E0E0]/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Instagram Feed
                                </Link>
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#E0E0E0]/60 hover:text-white hover:bg-white/5 flex items-center gap-1"
                                >
                                    <span>Lihat Website</span>
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </Link>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:border-[#FF6B00]/40 focus:outline-none"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                                            <span>{user.name}</span>
                                            <span className="material-symbols-outlined text-base text-[#E0E0E0]/70">expand_more</span>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Edit Profil Admin
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-[#E0E0E0]/70 hover:bg-white/5 hover:text-white focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-2xl">
                                    {showingNavigationDropdown ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-white/10 bg-[#141414]'}>
                    <div className="space-y-1 pb-3 pt-2 px-4">
                        <Link
                            href={route('dashboard')}
                            className={`block px-3 py-2 rounded-lg text-xs font-bold uppercase ${
                                route().current('dashboard') ? 'text-white bg-[#FF6B00]' : 'text-[#E0E0E0]/70 hover:text-white'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('admin.reservations.index')}
                            className={`block px-3 py-2 rounded-lg text-xs font-bold uppercase ${
                                route().current('admin.reservations.*') ? 'text-white bg-[#FF6B00]' : 'text-[#E0E0E0]/70 hover:text-white'
                            }`}
                        >
                            Reservasi Meja
                        </Link>
                        <Link
                            href={route('admin.menus.index')}
                            className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-[#E0E0E0]/70 hover:text-white"
                        >
                            Katalog Menu
                        </Link>
                        <Link
                            href={route('admin.hero-banners.index')}
                            className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-[#E0E0E0]/70 hover:text-white"
                        >
                            Hero Banners
                        </Link>
                        <Link
                            href={route('admin.galleries.index')}
                            className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-[#E0E0E0]/70 hover:text-white"
                        >
                            Galeri Foto
                        </Link>
                        <Link
                            href={route('admin.instagram-posts.index')}
                            className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-[#E0E0E0]/70 hover:text-white"
                        >
                            Instagram Feed
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="block px-3 py-2 rounded-lg text-xs font-bold uppercase text-[#FF6B00]"
                        >
                            Lihat Website Publik &rarr;
                        </Link>
                    </div>

                    <div className="border-t border-white/10 pb-3 pt-3 px-4">
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[11px] text-[#E0E0E0]/60">{user.email}</div>
                        <div className="mt-3 space-y-1">
                            <Link href={route('profile.edit')} className="block text-xs text-[#E0E0E0]/80 py-1">
                                Edit Profil
                            </Link>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="block text-xs text-rose-400 font-bold py-1 w-full text-left"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Title Section */}
            {header && (
                <header className="bg-[#181818]/60 border-b border-white/10">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Clean Minimal Admin Footer */}
            <footer className="w-full border-t border-white/10 bg-[#141414] py-6 sm:py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-2">
                    <Link href="/" className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
                        <img
                            src="/images/logo.png"
                            alt="Pintu Dua Coffeehouse Logo"
                            className="h-8 sm:h-9 w-auto object-contain rounded-lg glow-orange-sm"
                        />
                        <div className="flex flex-col text-left">
                            <span className="font-display text-base sm:text-lg uppercase tracking-wider text-white leading-none">
                                PINTU DUA
                            </span>
                            <span className="text-[8px] font-bold uppercase text-[#FF6B00] tracking-[0.2em] leading-tight">
                                Coffeehouse & Smokehouse
                            </span>
                        </div>
                    </Link>
                </div>
            </footer>

            {/* Floating Toast Notification Popup */}
            {toast && (
                <div className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-bounce-once font-bold text-xs uppercase tracking-wider bg-[#181818] border-white/10 text-white glow-orange-sm">
                    {toast.type === 'success' ? (
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">error</span>
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-white text-xs">{toast.type === 'success' ? 'Berhasil!' : 'Perhatian!'}</p>
                        <p className="text-[11px] font-medium text-[#E0E0E0]/80 normal-case">{toast.message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="ml-3 text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                </div>
            )}
        </div>
    );
}
