<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PresenceRecord extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'date', 'person_id', 'person_type', 
        'check_in', 'check_out', 'status_in', 'status_out'
    ];

    public function person(): MorphTo
    {
        return $this->morphTo();
    }
}
