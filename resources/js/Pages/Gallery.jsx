import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CommunityGallery from '@/Components/CommunityGallery';

export default function GalleryPage({ galleries = [] }) {
    return (
        <AppLayout currentRoute="gallery">
            <Head title="Community Gallery & Vibe | Pintu Dua Coffeehouse" />
            <CommunityGallery items={galleries} />
        </AppLayout>
    );
}
