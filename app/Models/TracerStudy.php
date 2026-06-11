<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TracerStudy extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'entry_year',
        'status',
        'institution_name',
        'position_or_major',
        'income_range',
        'contact_number',
        'notes',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
