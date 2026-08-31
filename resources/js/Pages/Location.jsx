import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import LocationHours from '@/Components/LocationHours';

export default function LocationPage() {
    return (
        <AppLayout currentRoute="location">
            <Head title="Location & Hours | Pintu Dua Coffeehouse" />
            <LocationHours />
        </AppLayout>
    );
}
