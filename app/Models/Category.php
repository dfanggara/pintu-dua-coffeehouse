<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $primaryKey = 'slug';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'type',
        'description',
    ];

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class, 'category_slug', 'slug');
    }
}
