<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'booking_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'booking_code',
        'customer_name',
        'pax',
        'reservation_date',
        'reservation_time',
        'special_notes',
        'status',
    ];
}
