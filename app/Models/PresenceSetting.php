<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresenceSetting extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'type', 'start_time', 'limit_time', 'end_time'
    ];
}
