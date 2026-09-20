import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import LocationHours from '@/Components/LocationHours';

export default function LocationPage() {
    return (
        <AppLayout currentRoute="location">
            <Head>
                <title>Location & Hours | Pintu Dua Coffeehouse</title>
                <meta name="description" content="Temukan lokasi Pintu Dua Coffeehouse di Lubang Buaya, Jakarta Timur. Cek jam operasional kami dan kunjungi kedai kopi paling asyik hari ini." />
                <meta name="keywords" content="lokasi pintu dua, jam buka pintu dua, alamat coffee shop lubang buaya" />
            </Head>
            <LocationHours />
        </AppLayout>
    );
}
