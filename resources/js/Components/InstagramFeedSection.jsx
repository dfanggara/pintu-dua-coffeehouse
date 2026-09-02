import React from 'react';

export default function InstagramFeedSection({ items = [] }) {
    // If there are no Instagram posts in the database, don't render the section
    if (!items || items.length === 0) {
        return null;
    }

    const displayPosts = items.slice(0, 10);

    return (
        <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-16 min-h-[calc(100vh-70px)] lg:min-h-0 flex flex-col justify-center relative overflow-hidden my-2 lg:my-8">
            {/* Outlined Repeating Background Watermark Text
            <div className="absolute top-2 sm:top-4 left-0 right-0 w-full overflow-hidden select-none pointer-events-none z-0 flex justify-center">
                <div className="whitespace-nowrap font-display text-4xl sm:text-7xl md:text-8xl lg:text-[9rem] uppercase font-black text-transparent tracking-widest leading-none opacity-15" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>
                    INSTAGRAM &bull; INSTAGRAM &bull; INSTAGRAM
                </div>
            </div> */}

            {/* Centered Compact Container for Grid */}
            <div className="max-w-4xl mx-auto relative z-10 w-full">
                {/* FORE Style Header: Follow kami! + @username + Pill Follow Button */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                    <span className="text-xs sm:text-sm font-medium text-[#E0E0E0]/80 tracking-wider mb-1">
                        Follow kami!
                    </span>
                    <h3 className="font-display text-2xl sm:text-4xl uppercase tracking-wider font-bold text-[#FF6B00] mb-3">
                        @pintuduacoffeehouse
                    </h3>

                    {/* Pill Follow Button */}
                    <a
                        href="https://www.instagram.com/pintuduacoffeehouse?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#FF6B00]/40 bg-[#181818] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF6B00] hover:text-[#121212] transition-all duration-300 shadow-lg group"
                    >
                        <svg className="w-4 h-4 fill-[#FF6B00] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                        <span>Follow</span>
                    </a>
                </div>

                {/* FORE Style Grid: 2-Column on Mobile (up to 10 posts), 3-Column Grid on Desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                    {displayPosts.map((post, idx) => (
                        <a
                            key={post.code || idx}
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#181818] border border-white/10 shadow-xl hover:border-[#FF6B00]/60 active:scale-95 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Image Thumbnail */}
                            <img
                                src={post.thumbnail_url}
                                alt={post.caption || 'Instagram Post'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Top-Right Badge Icon (Video or Carousel) */}
                            {post.post_type === 'video' && (
                                <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md">
                                    <span className="material-symbols-outlined text-xs">play_arrow</span>
                                </div>
                            )}
                            {post.post_type === 'carousel' && (
                                <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md">
                                    <span className="material-symbols-outlined text-xs">filter_none</span>
                                </div>
                            )}

                            {/* Hover / Touch Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5 z-20">
                                <div className="flex justify-end">
                                    <span className="material-symbols-outlined text-white/80 text-sm">open_in_new</span>
                                </div>

                                <div>
                                    {post.caption && (
                                        <p className="text-white text-[9px] font-medium line-clamp-2 leading-tight mb-1">
                                            {post.caption}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-[#FF6B00] uppercase tracking-wider">
                                        <span>Lihat IG</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
