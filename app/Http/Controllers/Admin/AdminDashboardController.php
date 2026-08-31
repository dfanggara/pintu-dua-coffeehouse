<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Menu;
use App\Models\Reservation;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();

        $stats = [
            'total_reservations_today' => Reservation::whereDate('reservation_date', $today)->count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'confirmed_reservations' => Reservation::where('status', 'confirmed')->count(),
            'active_menus' => Menu::where('is_active', true)->count(),
            'inactive_menus' => Menu::where('is_active', false)->count(),
            'total_galleries' => Gallery::where('is_active', true)->count(),
        ];

        $latestReservations = Reservation::latest()->take(5)->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'latestReservations' => $latestReservations,
        ]);
    }
}
