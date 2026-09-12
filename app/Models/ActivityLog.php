<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'action',
        'module',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function record(string $action, string $module, string $description)
    {
        if (Auth::check()) {
            $user = Auth::user();

            self::query()->create([
                'user_id' => Auth::id(),
                'user_name' => data_get($user, 'name', 'System'),
                'action' => $action,
                'module' => $module,
                'description' => $description,
            ]);
        }
    }
}
