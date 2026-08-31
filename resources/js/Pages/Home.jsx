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
            <Head title="Pintu Dua Coffeehouse | Modern Urban Sanctuary" />

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
