<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Extracurricular extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function coach()
    {
        return $this->belongsTo(Teacher::class, 'coach_id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'extracurricular_student')
                    ->withTimestamps();
    }

    public function schedules()
    {
        return $this->hasMany(EskulSchedule::class, 'extracurricular_id');
    }
}
