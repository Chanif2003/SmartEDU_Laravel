<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Applicant extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'birth_date' => 'date',
        'documents_path' => 'array',
    ];

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }
}
