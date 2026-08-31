<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Models\Reservation;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    /**
     * Handle incoming reservation POST request.
     */
    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();

        // Generate unique booking code e.g. RSV-2610-001 or RSV-89A2
        $todayStr = date('dm');
        $randomStr = strtoupper(Str::random(4));
        $bookingCode = "RSV-{$todayStr}-{$randomStr}";

        $reservation = Reservation::create([
            'booking_code' => $bookingCode,
            'customer_name' => $validated['customer_name'],
            'pax' => $validated['pax'],
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'special_notes' => $validated['special_notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Reservation created successfully',
            'booking_code' => $reservation->booking_code,
            'data' => $reservation,
        ], 201);
    }
}
