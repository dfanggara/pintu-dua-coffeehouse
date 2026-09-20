import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FullCatalog from '@/Components/FullCatalog';

export default function MenuPage({ categories = [] }) {
    return (
        <AppLayout currentRoute="menu">
            <Head>
                <title>Full Menu Catalog | Pintu Dua Coffeehouse</title>
                <meta name="description" content="Jelajahi menu lengkap Pintu Dua Coffeehouse. Dari racikan kopi signature, non-coffee, hingga kudapan lezat dengan harga bersahabat." />
                <meta name="keywords" content="menu pintu dua, harga kopi pintu dua, menu cafe lubang buaya, signature coffee" />
            </Head>
            <FullCatalog categories={categories} />
        </AppLayout>
    );
}
