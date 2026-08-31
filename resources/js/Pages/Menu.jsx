import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FullCatalog from '@/Components/FullCatalog';

export default function MenuPage({ categories = [] }) {
    return (
        <AppLayout currentRoute="menu">
            <Head title="Full Menu Catalog | Pintu Dua Coffeehouse" />
            <FullCatalog categories={categories} />
        </AppLayout>
    );
}
