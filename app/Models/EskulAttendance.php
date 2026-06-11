<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EskulAttendance extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'records' => 'array',
        ];
    }

    public function schedule()
    {
        return $this->belongsTo(EskulSchedule::class, 'eskul_schedule_id');
    }

    public function extracurricular()
    {
        return $this->belongsTo(Extracurricular::class, 'extracurricular_id');
    }

    public function coach()
    {
        return $this->belongsTo(Teacher::class, 'coach_id');
    }
}
