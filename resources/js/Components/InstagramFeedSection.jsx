import React from 'react';

export default function InstagramFeedSection({ items = [] }) {
    // If there are no Instagram posts in the database, don't render the section
    if (!items || items.length === 0) {
        return null;
    }

    const displayPosts = items.slice(0, 9);

    return (
        <section className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-12 mb-8 sm:mb-16 relative overflow-hidden">
            {/* Responsive Stretching Background Watermark Banner */}
            <div className="absolute top-2 sm:top-4 left-0 right-0 w-full overflow-hidden select-none pointer-events-none z-0">
                <div className="whitespace-nowrap font-display text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] uppercase font-black text-white/[0.04] tracking-widest leading-none text-center">
                    INSTAGRAM &bull; INSTAGRAM &bull; INSTAGRAM &bull; INSTAGRAM
                </div>
            </div>

            {/* Centered Compact Container for Grid */}
            <div className="max-w-3xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-5 sm:mb-8">
                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#FF6B00] mb-1">
                        Social Community
                    </span>
                    <h3 className="section-title text-xl sm:text-3xl">
                        Follow Us On Instagram
                    </h3>
                </div>

                {/* Centered 3x3 Grid Layout */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4">
                    {displayPosts.map((post, idx) => (
                        <a
                            key={post.code || idx}
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden bg-[#181818] border border-white/10 shadow-lg hover:border-[#FF6B00]/60 active:scale-95 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Image Thumbnail */}
                            <img
                                src={post.thumbnail_url}
                                alt={post.caption || 'Instagram Post'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Top-Right Badge Icon (Video or Carousel) */}
                            {post.post_type === 'video' && (
                                <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md">
                                    <span className="material-symbols-outlined text-[10px] sm:text-base">play_arrow</span>
                                </div>
                            )}
                            {post.post_type === 'carousel' && (
                                <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md">
                                    <span className="material-symbols-outlined text-[10px] sm:text-base">filter_none</span>
                                </div>
                            )}

                            {/* Hover / Touch Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2 sm:p-4 z-20">
                                <div className="flex justify-end">
                                    <span className="material-symbols-outlined text-white/80 text-xs sm:text-xl">open_in_new</span>
                                </div>

                                <div>
                                    {post.caption && (
                                        <p className="text-white text-[9px] sm:text-xs font-medium line-clamp-2 leading-tight sm:leading-snug mb-1">
                                            {post.caption}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 text-[8px] sm:text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[10px] sm:text-sm">photo_camera</span>
                                        <span>Lihat IG</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Bottom Footer Text Link */}
                <div className="text-center mt-5 sm:mt-8">
                    <a
                        href="https://www.instagram.com/pintuduacoffeehouse?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-[#E0E0E0]/80 hover:text-[#FF6B00] underline tracking-wider transition-colors duration-200"
                    >
                        Follow Us On Instagram <span className="font-extrabold text-white">@pintuduacoffeehouse</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
