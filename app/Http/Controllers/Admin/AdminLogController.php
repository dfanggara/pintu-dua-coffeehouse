<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $module = $request->query('module');
        $action = $request->query('action');

        $logs = ActivityLog::with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($module, function ($query, $module) {
                $query->where('module', $module);
            })
            ->when($action, function ($query, $action) {
                $query->where('action', $action);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $search ?? '',
                'module' => $module ?? '',
                'action' => $action ?? '',
            ],
        ]);
    }
}
