import React from 'react';

export default function StorySection() {
    return (
        <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 mb-12 sm:mb-16 relative overflow-hidden">
            {/* Stretching Responsive Background Watermark Banner */}
            <div className="absolute top-2 sm:top-4 left-0 right-0 w-full overflow-hidden select-none pointer-events-none z-0">
                <div className="whitespace-nowrap font-display text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] uppercase font-black text-white/[0.04] tracking-widest leading-none">
                    OUR STORY &bull; OUR STORY &bull; OUR STORY &bull; OUR STORY
                </div>
            </div>

            {/* Header Title with Accent */}
            <div className="relative z-10 flex items-center gap-3 mb-8 sm:mb-10 pt-2">
                <div className="section-accent" />
                <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#FF6B00]">
                        The Sanctuary Story
                    </span>
                    <h3 className="section-title">
                        Our Story
                    </h3>
                </div>
            </div>

            {/* 2-Column Content Layout (Photo Left, Text Right) */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
                {/* Left Column: Styled Photo with Curved Rounded Corners */}
                <div className="lg:col-span-5">
                    <div className="relative group pd-card rounded-tl-[60px] rounded-br-[60px] sm:rounded-tl-[80px] sm:rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl overflow-hidden border border-white/10 shadow-2xl h-[340px] sm:h-[420px]">
                        <img
                            src="/images/community-group.jpg"
                            alt="Pintu Dua Community & Friends"
                            className="pd-card-img object-cover w-full h-full object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-5 left-5 right-5 z-10 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00] bg-[#121212]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#FF6B00]/40 shadow-md">
                                Pintu Dua Coffee
                            </span>
                            <span className="text-[10px] font-bold text-white/80 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                Est. 2021
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Story Text Paragraphs */}
                <div className="lg:col-span-7 space-y-5 text-[#E0E0E0]/85 text-sm sm:text-base leading-relaxed">
                    <p className="border-l-4 border-[#FF6B00] pl-4 sm:pl-6 text-white font-medium text-base sm:text-lg leading-relaxed">
                        Born in the neighborhood, perfected in every cup. Pintu Dua is more than just a coffeehouse—it’s an urban sanctuary for bold flavors, raw energy, and authentic connections.
                    </p>

                    <p className="text-[#E0E0E0]/80 leading-relaxed">
                        Berawal dari sebuah ruang temu sederhana, Pintu Dua hadir sebagai tempat persinggahan bagi mereka yang mencari rasa dan suasana tanpa kepalsuan. Setiap cangkir kopi kami seduh dengan presisi tinggi, memadukan biji kopi pilihan dengan karakter rasa yang tegas dan berani.
                    </p>

                    <p className="text-[#E0E0E0]/80 leading-relaxed">
                        Kami percaya bahwa momen terbaik seringkali tercipta dari hal sederhana: secangkir kopi yang nikmat, percakapan yang jujur, dan ruang yang membuat kita merasa diterima. Di sinilah Pintu Dua menjadi lebih dari sekadar tempat—tetapi sebagai bagian dari cerita Anda.
                    </p>

                    {/* Stats Highlights */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center sm:text-left">
                        <div>
                            <span className="font-display text-3xl sm:text-4xl text-[#FF6B00] block font-bold">100%</span>
                            <span className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-wider font-semibold">Artisan Coffee</span>
                        </div>
                        <div>
                            <span className="font-display text-3xl sm:text-4xl text-[#FF6B00] block font-bold">14-HR</span>
                            <span className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-wider font-semibold">Smoked Meats</span>
                        </div>
                        <div>
                            <span className="font-display text-3xl sm:text-4xl text-[#FF6B00] block font-bold">LATE</span>
                            <span className="text-[10px] sm:text-xs text-[#E0E0E0]/60 uppercase tracking-wider font-semibold">Night Chill Vibe</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
