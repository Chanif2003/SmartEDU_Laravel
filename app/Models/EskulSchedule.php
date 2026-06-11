<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EskulSchedule extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function extracurricular()
    {
        return $this->belongsTo(Extracurricular::class, 'extracurricular_id');
    }
}
