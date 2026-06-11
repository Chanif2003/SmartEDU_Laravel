<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryItem extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'item_code',
        'name',
        'category',
        'condition',
        'location',
        'quantity',
        'notes',
        'last_checked_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'last_checked_at' => 'datetime',
    ];
}
