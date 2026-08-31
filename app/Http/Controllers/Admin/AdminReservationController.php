<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReservationController extends Controller
{
    /**
     * Display a listing of all reservations for admin with search & pagination.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $reservations = Reservation::query()
            ->when($search, function ($query, $search) {
                $query->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('booking_code', 'like', "%{$search}%")
                    ->orWhere('reservation_date', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => $reservations,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Update status of reservation (confirmed / cancelled / pending).
     */
    public function updateStatus(Request $request, $bookingCode)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $reservation = Reservation::findOrFail($bookingCode);
        $reservation->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status reservasi berhasil diperbarui!');
    }

    /**
     * Soft delete a reservation.
     */
    public function destroy($bookingCode)
    {
        $reservation = Reservation::findOrFail($bookingCode);
        $reservation->delete();

        return redirect()->back()->with('success', 'Reservasi berhasil dihapus!');
    }
}
