<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReservationController extends Controller
{
    /**
     * Display a listing of all reservations for admin with status, month filter & pagination (6 items).
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $period = $request->query('period');
        $sort = $request->query('sort', 'latest');

        $reservations = Reservation::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('customer_name', 'like', "%{$search}%")
                        ->orWhere('booking_code', 'like', "%{$search}%")
                        ->orWhere('special_notes', 'like', "%{$search}%")
                        ->orWhere('reservation_date', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($period, function ($query, $period) {
                if ($period === 'today') {
                    $query->whereDate('reservation_date', now()->toDateString());
                } elseif ($period === 'tomorrow') {
                    $query->whereDate('reservation_date', now()->addDay()->toDateString());
                } elseif ($period === 'this_month') {
                    $query->whereMonth('reservation_date', now()->month)
                        ->whereYear('reservation_date', now()->year);
                } elseif ($period === 'last_month') {
                    $lastMonth = now()->subMonth();
                    $query->whereMonth('reservation_date', $lastMonth->month)
                        ->whereYear('reservation_date', $lastMonth->year);
                } elseif (strlen($period) === 7) { // YYYY-MM
                    $query->where('reservation_date', 'like', "{$period}%");
                } elseif (strlen($period) === 10) { // YYYY-MM-DD
                    $query->whereDate('reservation_date', $period);
                }
            })
            ->when(true, function ($query) use ($sort) {
                match ($sort) {
                    'oldest' => $query->orderBy('reservation_date', 'asc')->orderBy('reservation_time', 'asc'),
                    'pax_desc' => $query->orderByRaw('CAST(pax AS UNSIGNED) DESC'),
                    'pax_asc' => $query->orderByRaw('CAST(pax AS UNSIGNED) ASC'),
                    'name_asc' => $query->orderBy('customer_name', 'asc'),
                    default => $query->orderBy('reservation_date', 'desc')->orderBy('reservation_time', 'desc'),
                };
            })
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => $reservations,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
                'period' => $period ?? '',
                'sort' => $sort ?? 'latest',
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
