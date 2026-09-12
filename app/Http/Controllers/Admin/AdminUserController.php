<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use App\Models\ActivityLog;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(10);
        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_admin' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => $validated['is_admin'] ?? false,
            'email_verified_at' => now(),
        ]);

        ActivityLog::record('CREATED', 'User', "Menambahkan akun baru: {$user->name}");

        return redirect()->back()->with('success', 'User berhasil ditambahkan!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'is_admin' => 'boolean',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Mencegah admin menghapus hak akses dirinya sendiri secara tidak sengaja
        if ($user->id === auth()->id()) {
            $user->is_admin = true;
        } else {
            $user->is_admin = $validated['is_admin'] ?? false;
        }
        
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        
        $user->save();

        ActivityLog::record('UPDATED', 'User', "Memperbarui akun: {$user->name}");

        return redirect()->back()->with('success', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $userName = $user->name;
        $user->delete();

        ActivityLog::record('DELETED', 'User', "Menghapus akun: {$userName}");

        return redirect()->back()->with('success', 'User berhasil dihapus!');
    }
}
