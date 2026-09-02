import React from 'react';

export default function StorySection() {
    return (
        <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-16 min-h-[calc(100vh-70px)] lg:min-h-0 flex flex-col justify-center relative overflow-hidden my-2 lg:my-8">
            {/* Header Title Container with Watermark Directly Behind Title on BOTH Mobile & Desktop */}
            <div className="relative z-10 mb-6 sm:mb-10 text-center lg:text-left">
                <div className="relative inline-flex flex-col justify-center items-center lg:items-start">
                    {/* Outlined Watermark text placed EXACTLY behind the Title */}
                    <div className="absolute inset-0 flex items-center justify-center lg:justify-start pointer-events-none select-none z-0">
                        <div className="whitespace-nowrap font-display text-4xl sm:text-7xl lg:text-8xl uppercase font-black text-transparent tracking-widest leading-none opacity-20" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>
                            OURSTORY OURSTORY OURSTORY
                        </div>
                    </div>

                    {/* <span className="relative z-10 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#FF6B00] block mb-1">
                        The Sanctuary Story
                    </span> */}
                    <h3 className="relative z-10 font-display text-3xl sm:text-5xl uppercase tracking-wider font-bold text-white">
                        Our <span className="text-[#FF6B00]">Story</span>
                    </h3>
                </div>
            </div>

            {/* Content Layout: Stacked on Mobile, 2-Column Grid on Desktop */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center max-w-2xl lg:max-w-none mx-auto">
                {/* Left Column: Styled Photo (Arch Dome on Mobile, Curved Card on Desktop) */}
                <div className="lg:col-span-5">
                    <div className="relative group pd-card rounded-t-[70px] lg:rounded-t-[80px] lg:rounded-br-[80px] rounded-b-2xl lg:rounded-bl-2xl overflow-hidden border border-white/10 shadow-2xl h-[300px] sm:h-[360px] lg:h-[430px] bg-[#181818]">
                        <img
                            src="/images/ourstory.png"
                            alt="Pintu Dua Community & Friends"
                            className="pd-card-img object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />

                        {/* <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-10 flex justify-between items-center">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#FF6B00] bg-[#121212]/90 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#FF6B00]/40 shadow-md">
                                Pintu Dua Coffee
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                                Est. 2021
                            </span>
                        </div> */}
                    </div>
                </div>

                {/* Right Column: Story Text Paragraphs */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-[#E0E0E0]/85 text-xs sm:text-base leading-relaxed text-left">
                    <p className="border-l-4 border-[#FF6B00] pl-3.5 sm:pl-6 text-white font-medium text-sm sm:text-lg leading-relaxed">
                        Born in the neighborhood, perfected in every cup. Pintu Dua is more than just a coffeehouse—it’s an urban sanctuary for bold flavors, raw energy, and authentic connections.
                    </p>

                    <p className="text-[#E0E0E0]/80 leading-relaxed text-xs sm:text-base">
                        Didirikan sebagai ruang temu sederhana, Pintu Dua hadir untuk mereka yang mencari karakter kopi asli dan suasana tanpa kepalsuan. Setiap cangkir diseduh dengan presisi tinggi dari biji kopi pilihan untuk menghadirkan rasa yang tegas dan autentik.
                    </p>

                    <p className="text-[#E0E0E0]/80 leading-relaxed text-xs sm:text-base">
                        Kami percaya bahwa momen terbaik tercipta dari hal sederhana: secangkir kopi nikmat, percakapan jujur, dan ruang yang membuat Anda merasa diterima. Di sinilah Pintu Dua menjadi bagian dari cerita Anda.
                    </p>
                </div>
            </div>
        </section>
    );
}
