import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import HeroCarousel from '@/Components/HeroCarousel';
import SignatureBites from '@/Components/SignatureBites';
import StorySection from '@/Components/StorySection';
import InstagramFeedSection from '@/Components/InstagramFeedSection';

export default function Home({ highlights = [], heroBanners = [], instagramPosts = [] }) {
    return (
        <AppLayout currentRoute="home">
            <Head>
                <title>Pintu Dua Coffeehouse | Modern Urban Sanctuary di Lubang Buaya</title>
                <meta name="description" content="Tempat ngopi asyik dan modern di Lubang Buaya, Jakarta Timur. Nikmati kopi signature, suasana nyaman, dan pesan tempatmu secara instan di Pintu Dua Coffeehouse." />
                <meta name="keywords" content="pintu dua, coffeehouse, coffee shop lubang buaya, cafe jakarta timur, tempat nongkrong, kopi enak, reservasi cafe" />
                <meta property="og:title" content="Pintu Dua Coffeehouse | Modern Urban Sanctuary" />
                <meta property="og:description" content="Tempat ngopi asyik dan modern di Lubang Buaya, Jakarta Timur. Nikmati kopi signature dan suasana nyaman." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://pintuduacoffee.com" />
            </Head>

            {/* Hero Section / Dynamic Database Carousel Banners */}
            <HeroCarousel items={heroBanners} />

            {/* The Story Section */}
            <StorySection />

            {/* Tier 1 Signature Highlights Overview */}
            <SignatureBites items={highlights} />

            {/* Instagram Social Feed Section */}
            <InstagramFeedSection items={instagramPosts} />
        </AppLayout>
    );
}
