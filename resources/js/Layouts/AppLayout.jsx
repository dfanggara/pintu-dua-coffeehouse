import React, { useState, createContext, useContext } from 'react';
import Navbar from '@/Components/Navbar';
import BottomNav from '@/Components/BottomNav';
import Footer from '@/Components/Footer';
import BookingBottomSheet from '@/Components/BookingBottomSheet';
import LoadingScreen from '@/Components/LoadingScreen';

export const BookingContext = createContext({
    onOpenBooking: () => {},
});

export const useBooking = () => useContext(BookingContext);

export default function AppLayout({ children, currentRoute = 'home' }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const handleOpenBooking = () => setIsBookingOpen(true);
    const handleCloseBooking = () => setIsBookingOpen(false);

    return (
        <BookingContext.Provider value={{ onOpenBooking: handleOpenBooking }}>
            <div className="min-h-screen bg-[#121212] text-[#E0E0E0] font-sans antialiased selection:bg-[#FF6B00] selection:text-[#121212] relative">
                {/* Brand Loading Screen Overlay */}
                <LoadingScreen />

                {/* Absolute Top Navigation Bar */}
                <Navbar onOpenBooking={handleOpenBooking} currentRoute={currentRoute} />

                {/* Page Content View with Header Offset Padding */}
                <main className="pt-20 sm:pt-24">{children}</main>

                {/* Footer */}
                <Footer />

                {/* Hybrid Reservation Bottom Sheet Modal */}
                <BookingBottomSheet isOpen={isBookingOpen} onClose={handleCloseBooking} />
            </div>
        </BookingContext.Provider>
    );
}
