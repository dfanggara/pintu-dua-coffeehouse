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
                            src="/images/ourstory.webp"
                            alt="Pintu Dua Community & Friends"
                            loading="lazy"
                            width="600"
                            height="430"
                            className="pd-card-img object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />


                    </div>
                </div>

                {/* Right Column: Story Text Paragraphs */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-[#E0E0E0]/85 text-xs sm:text-base leading-relaxed text-left">
                    <p className="border-l-4 border-[#FF6B00] pl-3.5 sm:pl-6 text-white font-medium text-sm sm:text-lg leading-relaxed">
                        Crafted for connection, brewed for the stories. Pintu Dua is your neighborhood living room where every cup sparks a conversation.
                    </p>

                    <p className="text-[#E0E0E0]/80 leading-relaxed text-xs sm:text-base">
                        Lebih dari sekadar menyajikan kopi, Pintu Dua didirikan untuk menjadi titik kumpul sosial yang nyata. Kami membangun ruang ini tanpa pretensi, memastikan siapa pun yang datang selalu merasa diterima layaknya kembali ke rumah sendiri.
                    </p>

                    <p className="text-[#E0E0E0]/80 leading-relaxed text-xs sm:text-base">
                        Kami percaya bahwa cerita-cerita terbaik sering kali mengalir perlahan di meja bar kami. Entah kamu datang untuk bernostalgia bersama kawan lama atau mencari obrolan baru, ruang ini selalu siap mendengarkan. Datang sebagai tamu, pulang sebagai kawan.
                    </p>
                </div>
            </div>
        </section>
    );
}
